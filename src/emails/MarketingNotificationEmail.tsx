import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
} from '@react-email/components';

interface MarketingNotificationProps {
  businessName?: string;
  businessOwnerEmail?: string;
  businessCategory?: string;
  businessPhone?: string;
  businessAddress?: string;
}

export const MarketingNotificationEmail = ({
  businessName = 'New Business',
  businessOwnerEmail = 'business@example.com',
  businessCategory = 'General',
  businessPhone,
  businessAddress,
}: MarketingNotificationProps) => (
  <Html>
    <Head />
    <Preview>New Business Registration - Action Required</Preview>
    <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif', color: '#374151' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <Section style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Img
              src={`${process.env.NEXT_PUBLIC_APP_URL || 'https://namibiaservices.com'}/images/mzansi-logo/logo-mobile.png`}
              alt="Namibia Services Logo"
              width="40"
              height="40"
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
            />
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', margin: 0, display: 'inline-block', verticalAlign: 'middle' }}>
              Namibia Services
            </Text>
          </div>
        </Section>

        <Section>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#dc2626', margin: '8px 0' }}>
            New Business Registration
          </Text>
          <Text style={{ fontSize: 16, margin: '16px 0' }}>
            A new business has registered and requires verification.
          </Text>

          <Section style={{ background: '#fef2f2', padding: 16, borderRadius: 6, margin: '24px 0', borderLeft: '4px solid #dc2626' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#991b1b', margin: '0' }}>
              ⚠️ Action Required
            </Text>
          </Section>

          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937', margin: '24px 0 12px 0' }}>
            Business Information:
          </Text>
          <Text style={{ fontSize: 14, margin: '8px 0', paddingLeft: 12, borderLeft: '2px solid #d1d5db' }}>
            <strong>Business Name:</strong> {businessName}
          </Text>
          <Text style={{ fontSize: 14, margin: '8px 0', paddingLeft: 12, borderLeft: '2px solid #d1d5db' }}>
            <strong>Owner Email:</strong> {businessOwnerEmail}
          </Text>
          {businessCategory && (
            <Text style={{ fontSize: 14, margin: '8px 0', paddingLeft: 12, borderLeft: '2px solid #d1d5db' }}>
              <strong>Category:</strong> {businessCategory}
            </Text>
          )}
          {businessPhone && (
            <Text style={{ fontSize: 14, margin: '8px 0', paddingLeft: 12, borderLeft: '2px solid #d1d5db' }}>
              <strong>Phone:</strong> {businessPhone}
            </Text>
          )}
          {businessAddress && (
            <Text style={{ fontSize: 14, margin: '8px 0', paddingLeft: 12, borderLeft: '2px solid #d1d5db' }}>
              <strong>Address:</strong> {businessAddress}
            </Text>
          )}

          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937', margin: '24px 0 12px 0' }}>
            Required Actions:
          </Text>
          <Text style={{ fontSize: 14, margin: '8px 0', paddingLeft: 16 }}>
            1. Review the business registration details
          </Text>
          <Text style={{ fontSize: 14, margin: '8px 0', paddingLeft: 16 }}>
            2. Contact the business owner to request CIPA documents
          </Text>
          <Text style={{ fontSize: 14, margin: '8px 0', paddingLeft: 16 }}>
            3. Verify the documents and approve the account
          </Text>
          <Text style={{ fontSize: 14, margin: '8px 0', paddingLeft: 16 }}>
            4. Update the business status to "PUBLISHED"
          </Text>
        </Section>

        <Section style={{ marginTop: 32, borderTop: '1px solid #e5e7eb', paddingTop: 16, textAlign: 'center', fontSize: 12, color: '#6b7280' }}>
          <Text>© 2025 Namibia Services. All rights reserved.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default MarketingNotificationEmail;
