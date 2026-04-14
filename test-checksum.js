const crypto = require('crypto');

// Known fields from PayGate callback
// PAYGATE docs say callback includes: "all fields"
const possibleFields = {
  PAYGATE_ID: '10011072130',
  PAY_REQUEST_ID: '007A75B5-FAC4-BED3-1C70-2210346BC054',
  REFERENCE: 'NS_SUB_cmlurjox00002lb04dxepukrv_1776180834279',
  TRANSACTION_STATUS: '0',
  TRANSACTION_ID: '1177577259',
  CHECKSUM: 'bb74e43e7bb816cf09716deb5b0fdb6b'
};

const merchantKey = 'secret';

// Try different combinations - maybe PAYGATE_ID, PAY_REQUEST_ID, REFERENCE, plus others
console.log('=== Testing with typical PayGate callback fields ===\n');

// Most common combinations from docs
const tests = [
  // All 5 main fields alphabetical (excluding CHECKSUM)
  {
    name: 'All 5 fields alphabetical',
    fields: ['PAY_REQUEST_ID', 'PAYGATE_ID', 'REFERENCE', 'TRANSACTION_ID', 'TRANSACTION_STATUS']
  },
  // Just the most important 3
  {
    name: 'PAYGATE_ID + PAY_REQUEST_ID + REFERENCE',
    fields: ['PAYGATE_ID', 'PAY_REQUEST_ID', 'REFERENCE']
  },
  // Without alphabetical sort (order as received)
  {
    name: 'No sort - as received',
    fields: ['PAYGATE_ID', 'PAY_REQUEST_ID', 'REFERENCE', 'TRANSACTION_STATUS', 'TRANSACTION_ID']
  },
];

tests.forEach(test => {
  const str = test.fields.map(f => possibleFields[f] || '').join('') + merchantKey;
  const checksum = crypto.createHash('md5').update(str).digest('hex');
  const isMatch = checksum === possibleFields.CHECKSUM;
  
  console.log(`${isMatch ? '✅' : '❌'} ${test.name}`);
  if (!isMatch) {
    console.log(`   Got: ${checksum}`);
  } else {
    console.log(`   MATCH! String: ${str}`);
    console.log(`   Fields in order: ${test.fields.join(' + ')}`);
  }
  console.log('');
});

// If still not matching, extract what we know PayGate MUST be sending
console.log('\n=== Analysis ===');
console.log('Expected CHECKSUM: ' + possibleFields.CHECKSUM);
console.log('Available fields:', Object.keys(possibleFields).filter(k => k !== 'CHECKSUM').join(', '));
console.log('\nIf none match: PayGate callback must include OTHER fields like AUTH_CODE, RESULT_DESC, etc.');
