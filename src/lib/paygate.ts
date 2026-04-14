import crypto from 'crypto';

export interface PayGateConfig {
  merchantId: string;
  merchantKey: string;
}

export interface PayGateCheckoutRequest {
  reference: string;
  amount: number; // in cents
  currency: string;
  email: string;
  description?: string;
  returnUrl: string;
  notifyUrl: string;
}

export interface PayGateCheckoutParams {
  PAYGATE_ID: string;
  REFERENCE: string;
  AMOUNT: string;
  CURRENCY: string;
  RETURN_URL: string;
  TRANSACTION_DATE: string;
  LOCALE: string;
  COUNTRY: string;
  EMAIL: string;
  NOTIFY_URL: string;
  CHECKSUM: string;
}

class PayGateService {
  private config: PayGateConfig;
  public readonly INITIATE_URL = 'https://secure.paygate.co.za/payweb3/initiate.trans';
  public readonly PROCESS_URL = 'https://secure.paygate.co.za/payweb3/process.trans';

  constructor(config: PayGateConfig) {
    this.config = config;
  }

  /**
   * Build signed params for initiate.trans.
   * These are returned to the browser which then POSTs them to PayGate directly.
   * This avoids server-side fetch being blocked by PayGate's CloudFront WAF.
   * 
   * ⚠️ CRITICAL: Fields must be in EXACT order for checksum calculation
   */
  buildInitiateParams(request: PayGateCheckoutRequest): PayGateCheckoutParams {
    if (!this.config.merchantId || !this.config.merchantKey) {
      throw new Error('PAYGATE_MERCHANT_ID and PAYGATE_MERCHANT_KEY must be set in environment variables');
    }

    const transactionDate = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    // Fields MUST be in this exact order for checksum calculation
    const fields: Record<string, string> = {
      PAYGATE_ID: this.config.merchantId,
      REFERENCE: request.reference,
      AMOUNT: String(request.amount),
      CURRENCY: request.currency,
      RETURN_URL: request.returnUrl,
      TRANSACTION_DATE: transactionDate,
      LOCALE: 'en-za',
      COUNTRY: 'ZAF',
      EMAIL: request.email,
      NOTIFY_URL: request.notifyUrl,
    };

    // Checksum = MD5(concat all values + merchant key)
    const checksumString = Object.values(fields).join('') + this.config.merchantKey;
    const checksum = crypto.createHash('md5').update(checksumString).digest('hex');

    return { ...fields, CHECKSUM: checksum } as PayGateCheckoutParams;
  }

  /**
   * Verify checksum from PayGate notify/return callback
   */
  verifyCallbackChecksum(data: Record<string, string>): boolean {
    const { CHECKSUM, ...rest } = data;
    if (!CHECKSUM) return false;
    const checksumString = Object.values(rest).join('') + this.config.merchantKey;
    const calculated = crypto.createHash('md5').update(checksumString).digest('hex');
    return calculated === CHECKSUM;
  }

  /**
   * Build checksum for redirect to process.trans
   * Checksum = MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
   */
  buildProcessChecksum(payRequestId: string, reference: string): string {
    const checksumString = this.config.merchantId + payRequestId + reference + this.config.merchantKey;
    return crypto.createHash('md5').update(checksumString).digest('hex');
  }

  /**
   * Verify checksum from PayGate RETURN_URL (client-side redirect after payment)
   * 
   * Per PayGate documentation, the return checksum is calculated as:
   * MD5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY)
   * 
   * Note: The return POST from PayGate only contains PAY_REQUEST_ID, TRANSACTION_STATUS, and CHECKSUM
   * The PAYGATE_ID must come from config, and REFERENCE must be looked up from the database
   * 
   * @param payRequestId - PAY_REQUEST_ID from PayGate return POST
   * @param reference - REFERENCE that was originally sent to PayGate (looked up from database)
   * @param checksum - CHECKSUM from PayGate return POST
   * @returns true if checksum is valid
   */
  verifyReturnChecksum(
    payRequestId: string,
    reference: string,
    checksum: string
  ): boolean {
    if (!checksum) return false;

    // Return checksum: PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY
    const checksumString =
      this.config.merchantId + payRequestId + reference + this.config.merchantKey;
    const calculated = crypto.createHash('md5').update(checksumString).digest('hex');

    console.log('[PayGate] Return checksum verification:', {
      expected: checksum,
      calculated,
      match: calculated === checksum,
      source: `${this.config.merchantId}${payRequestId}${reference}[KEY]`,
    });

    return calculated === checksum;
  }

  /**
   * Verify checksum from PayGate callback (Notify URL - server-side)
   * Per PayGate docs: MD5(all fields + KEY)
   * 
   * ⚠️ Special handling: Exclude CHECKSUM itself, include all others
   */
  verifyNotifyChecksum(data: Record<string, string>): boolean {
    const { CHECKSUM, ...rest } = data;
    if (!CHECKSUM) return false;
    
    console.log('[PayGate] ===== CALLBACK CHECKSUM VERIFICATION =====');
    console.log('[PayGate] Fields to verify (count=' + Object.keys(rest).length + '):');
    Object.keys(rest).sort().forEach(k => {
      console.log(`[PayGate]   ${k}=${rest[k]}`);
    });
    
    // Per PayGate docs: All fields in alphabetical order + KEY
    const sortedFields = Object.keys(rest).sort();
    const checksumString = sortedFields.map(k => rest[k] || '').join('') + this.config.merchantKey;
    const calculated = crypto.createHash('md5').update(checksumString).digest('hex');
    
    console.log('[PayGate] Checksum calculation:');
    console.log('[PayGate]   String:', checksumString);
    console.log('[PayGate]   Received:', CHECKSUM);
    console.log('[PayGate]   Calculated:', calculated);
    console.log('[PayGate]   Match:', calculated === CHECKSUM);
    
    if (calculated === CHECKSUM) {
      console.log('[PayGate] ✅ CHECKSUM VALID');
      return true;
    }
    
    // If mismatch, try without sorting (in case PayGate doesn't sort)
    console.log('[PayGate] First attempt failed - trying without sorting...');
    const unsortedString = Object.keys(rest).map(k => rest[k] || '').join('') + this.config.merchantKey;
    const calculated2 = crypto.createHash('md5').update(unsortedString).digest('hex');
    
    console.log('[PayGate]   Unsorted string:', unsortedString);
    console.log('[PayGate]   Calculated:', calculated2);
    console.log('[PayGate]   Match:', calculated2 === CHECKSUM);
    
    if (calculated2 === CHECKSUM) {
      console.log('[PayGate] ✅ CHECKSUM VALID (unsorted)');
      return true;
    }
    
    console.log('[PayGate] ❌ CHECKSUM VERIFICATION FAILED');
    console.log('[PayGate] Merchant Key configured:', this.config.merchantKey);
    
    return false;
  }

  processNotification(data: Record<string, string>): {
    success: boolean;
    reference: string;
    message: string;
  } {
    const success = data.TRANSACTION_STATUS === '1';
    return {
      success,
      reference: data.REFERENCE || '',
      message: success ? 'Payment successful' : `Payment failed: ${data.RESULT_DESC || 'Unknown'}`,
    };
  }
}

export const payGate = new PayGateService({
  merchantId: process.env.PAYGATE_MERCHANT_ID || '',
  merchantKey: process.env.PAYGATE_MERCHANT_KEY || '',
});

export default PayGateService;
