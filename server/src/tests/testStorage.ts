import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

async function testStorageAccess() {
  try {
    console.log('Starting storage access test...');
    const storage = new Storage();
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
    console.log(`Testing access to bucket: ${bucketName}`);

    // Test 1: Create a test file
    const testFileName = `test-${Date.now()}.txt`;
    console.log(`Attempting to create file: ${testFileName}`);
    
    const bucket = storage.bucket(bucketName as string);
    const file = bucket.file(testFileName);
    
    await file.save('Test content');
    console.log('✓ Successfully created test file');

    // Test 2: Read the file
    const [exists] = await file.exists();
    console.log('✓ File exists:', exists);

    // Test 3: Delete the file
    await file.delete();
    console.log('✓ Successfully deleted test file');

    console.log('\nAll storage tests passed! Your permissions are working correctly.');
  } catch (error) {
    console.error('Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

testStorageAccess();