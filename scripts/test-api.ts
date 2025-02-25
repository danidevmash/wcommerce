import { testStoresApiConnection } from '../lib/stores-api-test';

async function runTest() {
  try {
    await testStoresApiConnection();
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest(); 