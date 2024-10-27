import { Storage } from '@google-cloud/storage';
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';
import dotenv from 'dotenv';

dotenv.config();

async function testCloudSetup() {
  try {
    console.log('Testing Google Cloud Setup...');
    console.log('Credentials path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT);
    console.log('Bucket:', process.env.GOOGLE_CLOUD_STORAGE_BUCKET);

    // Test Storage with specific bucket
    console.log('\nTesting Storage...');
    const storage = new Storage();
    const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
    const bucket = storage.bucket(bucketName as string);
    
    // Test bucket access
    const [exists] = await bucket.exists();
    console.log('Bucket exists:', exists);

    if (!exists) {
      throw new Error(`Bucket ${bucketName} does not exist`);
    }

    // Test file upload
    const testFileName = `test-${Date.now()}.txt`;
    const file = bucket.file(testFileName);
    await file.save('Test content');
    console.log('Successfully uploaded test file');

    // Clean up
    await file.delete();
    console.log('Successfully deleted test file');

    // Test Video Intelligence API
    console.log('\nTesting Video Intelligence API...');
    const videoClient = new VideoIntelligenceServiceClient();
    console.log('Successfully created Video Intelligence client');

    console.log('\nAll tests passed! Your setup is working correctly.');
  } catch (error) {
    console.error('Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

testCloudSetup();