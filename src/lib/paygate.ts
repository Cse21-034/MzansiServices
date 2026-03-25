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
    this.baseUrl =
      config.environment === 'production'
        ? 'https://secure.paygate.co.za'
        : 'https://secure-test.paygate.co.za';
  }

  /**
   * Generate checksum for PayGate requests
   */
  private generateChecksum(data: string): string {
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', this.config.merchantKey)
      .update(data)
      .digest('hex');
  }

  /**
   * Verify checksum from PayGate notifications
   */
  verifyChecksum(data: string, checksum: string): boolean {
    const calculatedChecksum = this.generateChecksum(data);
    return calculatedChecksum === checksum;
  }

  /**
   * Create a checkout session
   * Returns URL to redirect user to PayGate
   */
  createCheckout(request: PayGateCheckoutRequest): PayGateCheckoutResponse {
    const sessionId = this.generateSessionId();

    // Build checksum data
    const checksumData = [
      this.config.merchantId,
      sessionId,
      request.reference,
      request.amount,
      request.currency,
      request.email,
      request.description || '',
      request.customData ? JSON.stringify(request.customData) : '',
    ]
      .filter((v) => v !== undefined && v !== null)
      .join('|');

    const checksum = this.generateChecksum(checksumData);

    const params = new URLSearchParams({
      PAYGATE_ID: this.config.merchantId,
      REFERENCE: request.reference,
      AMOUNT: request.amount.toString(),
      CURRENCY: request.currency,
      RETURN_URL: request.returnUrl,
      NOTIFY_URL: request.notifyUrl,
      EMAIL: request.email,
      SESSION_ID: sessionId,
      CHECKSUM: checksum,
    });

    if (request.description) {
      params.append('DESCRIPTION', request.description);
    }

    const redirectUrl = `${this.baseUrl}/payweb3/initiate.trans?${params.toString()}`;

    return {
      redirect: redirectUrl,
      checksum,
      sessionId,
    };
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
