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
