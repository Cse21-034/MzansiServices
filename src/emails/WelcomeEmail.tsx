import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
  Img,
} from '@react-email/components';

interface WelcomeEmailProps {
  businessName?: string;
  businessOwnerEmail?: string;
  businessCategory?: string;
}

export const WelcomeEmail = ({
  businessName = 'Your Business',
  businessOwnerEmail = 'user@example.com',
  businessCategory = 'General',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Namibia Services!</Preview>
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#059669', margin: '8px 0' }}>
            Welcome to Namibia Services!
          </Text>
          <Text style={{ fontSize: 16, margin: '16px 0' }}>
            Hello <strong>{businessName}</strong>,
          </Text>
          <Text style={{ fontSize: 16, margin: '16px 0' }}>
            Congratulations! Your business account has been successfully created on Namibia Services. We're excited to help you connect with customers and grow your business.
          </Text>

          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937', margin: '24px 0 12px 0' }}>
            Next Steps to Get Approved:
          </Text>
          <Text style={{ fontSize: 16, margin: '8px 0', paddingLeft: 16 }}>
            1. <strong>Log in</strong> to your account anytime to update your business information
          </Text>
          <Text style={{ fontSize: 16, margin: '8px 0', paddingLeft: 16 }}>
            2. <strong>Prepare your CIPA documents</strong> - These help us verify your business quickly
          </Text>
          <Text style={{ fontSize: 16, margin: '8px 0', paddingLeft: 16 }}>
            3. <strong>Send your CNR documents</strong> to: <strong>marketing@namibiaservices.com</strong>
          </Text>
          <Text style={{ fontSize: 16, margin: '8px 0', paddingLeft: 16 }}>
            4. Once verified, your account will be approved and fully activated
          </Text>

          <Section style={{ background: '#f3f4f6', padding: 16, borderRadius: 6, margin: '24px 0' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
              Account Details:
            </Text>
            <Text style={{ fontSize: 14, margin: '4px 0' }}>
              <strong>Email:</strong> {businessOwnerEmail}
            </Text>
            <Text style={{ fontSize: 14, margin: '4px 0' }}>
              <strong>Category:</strong> {businessCategory}
            </Text>
          </Section>

          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://namibiaservices.com'}/login`} style={{
              display: 'inline-block',
              backgroundColor: '#059669',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: 6,
              fontWeight: 'bold',
              textDecoration: 'none',
              fontSize: 16
            }}>
              Log In to Your Dashboard
            </Link>
          </Section>

          <Text style={{ fontSize: 14, color: '#6b7280', margin: '16px 0' }}>
            Questions? Contact our support team at <strong>marketing@namibiaservices.com</strong>
          </Text>
        </Section>

        <Section style={{ marginTop: 32, borderTop: '1px solid #e5e7eb', paddingTop: 16, textAlign: 'center', fontSize: 12, color: '#6b7280' }}>
          <Text>© 2025 Namibia Services. All rights reserved.</Text>
          <Text>This is an automated message, please do not reply to this email.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#f9f9f9',
  fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '20px',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const heading = {
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '16px 0',
  padding: '0',
  color: '#612C30',
};

const subHeading = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 16px 0',
};

const paragraph = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const hr = {
  borderColor: '#ddd',
  margin: '24px 0',
};

const highlightBox = {
  backgroundColor: '#f0f4f8',
  borderLeft: '4px solid #612C30',
  padding: '20px',
  margin: '20px 0',
};

const highlightTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const list = {
  color: '#333',
  lineHeight: '1.8',
  paddingLeft: '20px',
  margin: '0',
};

const listItem = {
  marginBottom: '8px',
};

const highlight = {
  color: '#612C30',
  fontWeight: 'bold',
};

const detailsBox = {
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '5px',
  margin: '20px 0',
};

const detailsLabel = {
  margin: '8px 0',
  color: '#333',
  fontSize: '14px',
};

const button = {
  backgroundColor: '#612C30',
  borderRadius: '5px',
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '24px 0',
  padding: '12px 30px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};

const footer = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '25px 0 0 0',
};

const footerText = {
  color: '#999',
  fontSize: '12px',
  margin: '4px 0',
  textAlign: 'center' as const,
};
