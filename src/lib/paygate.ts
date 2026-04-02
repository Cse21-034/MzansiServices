import crypto from 'crypto';

export interface PayGateConfig {
  merchantId: string;
  merchantKey: string;
  environment: 'production' | 'test';
}

export interface PayGateCheckoutRequest {
  reference: string;
  amount: number; // in CENTS already
  currency: string;
  email: string;
  description?: string;
  returnUrl: string;
  notifyUrl: string;
  customData?: Record<string, any>;
}

export interface PayGateCheckoutResponse {
  redirect: string;
  payRequestId: string;
  checksum: string;
  sessionId: string;
}

class PayGateService {
  private config: PayGateConfig;
  private readonly BASE_URL = 'https://secure.paygate.co.za/payweb3';

  constructor(config: PayGateConfig) {
    this.config = config;
  }

  /**
   * CRITICAL: Fields must be concatenated in EXACTLY this order
   * matching the official PHP example: implode('', $data) + key
   */
  private generateChecksum(fields: Record<string, string>): string {
    const concatenated = Object.values(fields).join('') + this.config.merchantKey;
    return crypto.createHash('md5').update(concatenated).digest('hex');
  }

  async createCheckout(request: PayGateCheckoutRequest): Promise<PayGateCheckoutResponse> {
    if (!this.config.merchantId || !this.config.merchantKey) {
      throw new Error('PayGate merchant credentials not configured');
    }

    // Format date exactly as PayGate expects: "Y-m-d H:i:s"
    const now = new Date();
    const transactionDate = now.toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    // IMPORTANT: Build fields in EXACT order for checksum
    // The checksum must be calculated on fields in insertion order
    const fields: Record<string, string> = {
      PAYGATE_ID: this.config.merchantId,
      REFERENCE: request.reference,
      AMOUNT: String(request.amount), // must already be in cents
      CURRENCY: request.currency,
      RETURN_URL: request.returnUrl,
      TRANSACTION_DATE: transactionDate,
      LOCALE: 'en-za',
      COUNTRY: 'ZAF', // Use ZAF - some PayGate accounts don't accept NAM
      EMAIL: request.email,
    };

    // Only add NOTIFY_URL if provided (it affects checksum order)
    if (request.notifyUrl) {
      fields.NOTIFY_URL = request.notifyUrl;
    }

    // Calculate checksum BEFORE adding CHECKSUM to fields
    const checksum = this.generateChecksum(fields);
    fields.CHECKSUM = checksum;

    // Build POST body
    const body = new URLSearchParams(fields).toString();

    console.log('[PayGate] Initiating transaction:', {
      reference: request.reference,
      amount: request.amount,
      currency: request.currency,
    });

    const response = await fetch(`${this.BASE_URL}/initiate.trans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Use your ACTUAL deployed domain here - must match what's in PayGate merchant portal
        'Referer': process.env.NEXTAUTH_URL || 'https://namibiaservices.com',
        'User-Agent': 'Mozilla/5.0',
      },
      body,
    });

    const responseText = await response.text();
    console.log('[PayGate] Response status:', response.status);
    console.log('[PayGate] Response body:', responseText);

    if (!response.ok) {
      throw new Error(`PayGate HTTP ${response.status}: ${responseText}`);
    }

    // Parse response: PAYGATE_ID=...&PAY_REQUEST_ID=...&REFERENCE=...&CHECKSUM=...
    const params = new URLSearchParams(responseText);
    const payRequestId = params.get('PAY_REQUEST_ID');
    const responseChecksum = params.get('CHECKSUM');

    if (!payRequestId) {
      // PayGate may return an error like: ERROR=DATA_CHK&DESCRIPTION=Checksum+error
      const error = params.get('ERROR');
      const description = params.get('DESCRIPTION');
      throw new Error(
        `PayGate rejected request: ${error || 'No PAY_REQUEST_ID'} - ${description || responseText}`
      );
    }

    return {
      redirect: `${this.BASE_URL}/process.trans`,
      payRequestId,
      checksum: responseChecksum || '',
      sessionId: `NS_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
  }

  /**
   * Verify checksum from PayGate redirect response
   * Order: PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + KEY
   */
  verifyRedirectChecksum(
    paygateId: string,
    payRequestId: string,
    reference: string,
    providedChecksum: string
  ): boolean {
    const str = paygateId + payRequestId + reference + this.config.merchantKey;
    const calculated = crypto.createHash('md5').update(str).digest('hex');
    return calculated === providedChecksum;
  }

  /**
   * Process PayGate ITN/callback notification
   */
  processNotification(data: Record<string, string>): {
    success: boolean;
    reference: string;
    message: string;
  } {
    // Verify the notification is genuine by rebuilding checksum
    // PayGate sends all fields; checksum is over specific fields
    const { CHECKSUM, ...rest } = data;
    const checksumString = Object.values(rest).join('') + this.config.merchantKey;
    const calculated = crypto.createHash('md5').update(checksumString).digest('hex');

    if (CHECKSUM && calculated !== CHECKSUM) {
      console.warn('[PayGate] Checksum mismatch on notification');
    }

    // TRANSACTION_STATUS: 1 = Approved, 2 = Declined, 4 = Cancelled
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
  environment: (process.env.PAYGATE_ENV as 'production' | 'test') || 'test',
});

export default PayGateService;
