/**
 * PayGate Integration Service
 * Handles all PayGate payment gateway interactions
 * PayGate Documentation: https://docs.paygate.co.za/
 */

export interface PayGateConfig {
  merchantId: string;
  merchantKey: string;
  apiKey: string;
  environment: 'production' | 'test';
}

export interface PayGateCheckoutRequest {
  reference: string;
  amount: number;
  currency: string;
  email: string;
  description: string;
  returnUrl: string;
  notifyUrl: string;
  customData?: Record<string, any>;
}

export interface PayGateCheckoutResponse {
  redirect: string;
  checksum: string;
  sessionId: string;
  payRequestId?: string;
}

export interface PayGateNotification {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  transactionId: string;
  customData?: Record<string, any>;
  checksum: string;
}

class PayGateService {
  private config: PayGateConfig;
  private baseUrl: string;

  constructor(config: PayGateConfig) {
    this.config = config;
    // Both test and production use the same domain (sandbox controlled by merchant credentials)
    this.baseUrl = 'https://secure.paygate.co.za';
  }

  /**
   * Generate checksum for PayGate requests (MD5)
   * All field values concatenated + merchant key, then MD5 hashed
   */
  private generateChecksum(data: string): string {
    const crypto = require('crypto');
    const checksumString = data + this.config.merchantKey;
    return crypto.createHash('md5').update(checksumString).digest('hex');
  }

  /**
   * Verify checksum from PayGate notifications
   */
  verifyChecksum(data: string, checksum: string): boolean {
    const calculatedChecksum = this.generateChecksum(data);
    return calculatedChecksum === checksum;
  }

  /**
   * Step 1: Server-side POST to initiate.trans
   * This returns a PAY_REQUEST_ID which is used for the browser redirect
   */
  async createCheckout(request: PayGateCheckoutRequest): Promise<PayGateCheckoutResponse> {
    // Validate merchant config
    if (!this.config.merchantId) {
      throw new Error('PayGate merchant ID not configured. Set PAYGATE_MERCHANT_ID environment variable.');
    }
    if (!this.config.merchantKey) {
      throw new Error('PayGate merchant key not configured. Set PAYGATE_MERCHANT_KEY environment variable.');
    }

    const transactionDate = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    // Build form data for initiate.trans
    const formData: Record<string, string> = {
      PAYGATE_ID: this.config.merchantId,
      REFERENCE: request.reference,
      AMOUNT: request.amount.toString(),
      CURRENCY: request.currency,
      RETURN_URL: request.returnUrl,
      TRANSACTION_DATE: transactionDate,
      LOCALE: 'en-za',
      COUNTRY: 'NAM', // Namibia
      EMAIL: request.email,
      NOTIFY_URL: request.notifyUrl,
    };

    if (request.description) {
      formData.DESCRIPTION = request.description;
    }

    // Generate checksum: all values concatenated + merchant key, then MD5
    const checksumString = Object.values(formData).join('');
    const checksum = this.generateChecksum(checksumString);
    formData.CHECKSUM = checksum;

    try {
      // Step 1: POST to initiate.trans (server-side)
      const response = await fetch(`${this.baseUrl}/payweb3/initiate.trans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`PayGate HTTP ${response.status}: ${responseText}`);
      }

      const responseText = await response.text();

      // Parse response: PAYGATE_ID=...&PAY_REQUEST_ID=...&REFERENCE=...&CHECKSUM=...
      const params = new URLSearchParams(responseText);
      const payRequestId = params.get('PAY_REQUEST_ID');
      const responseChecksum = params.get('CHECKSUM');

      if (!payRequestId) {
        throw new Error(`Failed to get PAY_REQUEST_ID from PayGate. Response: ${responseText}`);
      }

      // Return data needed for Step 2 (browser redirect)
      const sessionId = this.generateSessionId();

      return {
        redirect: `${this.baseUrl}/payweb3/process.trans`,
        checksum: responseChecksum || checksum,
        sessionId,
        payRequestId,
      };
    } catch (error) {
      console.error('PayGate initiate.trans error:', error);
      throw error;
    }
  }

  /**
   * Process PayGate notification/callback
   */
  async processNotification(data: Record<string, string>): Promise<{
    success: boolean;
    reference: string;
    message: string;
  }> {
    try {
      // Verify checksum
      const checksumData = [
        data.PAYGATE_ID,
        data.REFERENCE,
        data.TRANSACTION_ID,
        data.STATUS,
        data.AMOUNT,
        data.CURRENCY,
      ]
        .filter((v) => v)
        .join('|');

      if (!this.verifyChecksum(checksumData, data.CHECKSUM)) {
        return {
          success: false,
          reference: data.REFERENCE || 'unknown',
          message: 'Checksum verification failed',
        };
      }

      // Handle status based on PayGate response codes
      const success = data.STATUS === '1'; // 1 = Success, 0 = Failed

      return {
        success,
        reference: data.REFERENCE,
        message: success ? 'Payment successful' : 'Payment failed',
      };
    } catch (error) {
      console.error('PayGate notification processing error:', error);
      return {
        success: false,
        reference: data.REFERENCE || 'unknown',
        message: 'Error processing payment notification',
      };
    }
  }

  /**
   * Query transaction status
   */
  async queryTransaction(
    reference: string
  ): Promise<{
    status: string;
    transactionId: string;
    amount: number;
  }> {
    try {
      // This would require additional PayGate API implementation
      // For now, returning a placeholder
      const response = await fetch(`${this.baseUrl}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          merchantId: this.config.merchantId,
          reference,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to query transaction');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error querying transaction:', error);
      throw error;
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `NS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate payment amount
   */
  validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 999999.99;
  }

  /**
   * Format amount for PayGate (cents)
   */
  formatAmount(amount: number): number {
    return Math.round(amount * 100);
  }
}

// Initialize PayGate Service
const payGateConfig: PayGateConfig = {
  merchantId: process.env.PAYGATE_MERCHANT_ID || '',
  merchantKey: process.env.PAYGATE_MERCHANT_KEY || '',
  apiKey: process.env.PAYGATE_API_KEY || '',
  environment: (process.env.PAYGATE_ENV as 'production' | 'test') || 'test',
};

export const payGate = new PayGateService(payGateConfig);

export default PayGateService;
