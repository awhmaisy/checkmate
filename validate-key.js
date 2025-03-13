// Simple script to validate API key format
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.XAI_API_KEY;

console.log('API Key Check:');
console.log('-------------');
console.log('API Key Present:', !!apiKey);

if (apiKey) {
  console.log('API Key Length:', apiKey.length);
  console.log('API Key Format:', /^[A-Za-z0-9_-]{20,}$/.test(apiKey) ? 'Looks valid' : 'Might be invalid');
  console.log('First 4 chars:', apiKey.substring(0, 4) + '...');
  console.log('Last 4 chars:', '...' + apiKey.substring(apiKey.length - 4));
  
  // Check for common issues
  if (apiKey.includes('"') || apiKey.includes("'")) {
    console.log('WARNING: API key contains quotes. Remove them from your .env.local file');
  }
  
  if (apiKey.includes(' ')) {
    console.log('WARNING: API key contains spaces. Remove them from your .env.local file');
  }
  
  if (apiKey === 'your-api-key-here' || apiKey === 'dummy-key' || apiKey === 'dummy-key-for-testing') {
    console.log('WARNING: You are using a placeholder API key. Replace it with your actual API key');
  }
} else {
  console.log('ERROR: No API key found in .env.local file');
}
