// src/tests/videoAnalysisTest.ts
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';
import { Storage } from '@google-cloud/storage';

async function testVideoAnalysis() {
  try {
    console.log('Starting video analysis test...');

    // Initialize clients with explicit credentials path
    const videoClient = new VideoIntelligenceServiceClient({
      keyFilename: './config/google-cloud/service-account-key.json'
    });
    const storage = new Storage({
      keyFilename: './config/google-cloud/service-account-key.json'
    });
    
    console.log('Clients initialized successfully');
    
    // Test storage bucket access
    const bucketName = 'commskill-videos';
    try {
      const [buckets] = await storage.getBuckets();
      console.log('Available buckets:', buckets.map(b => b.name).join(', '));
      
      // Check if our bucket exists
      const bucket = storage.bucket(bucketName);
      const [exists] = await bucket.exists();
      console.log(`Bucket ${bucketName} exists:`, exists);
      
      if (!exists) {
        console.log('Creating bucket...');
        await storage.createBucket(bucketName);
        console.log('Bucket created successfully');
      }
    } catch (storageError) {
      console.error('Storage test failed:', storageError);
      throw storageError;
    }

    // Test Video Intelligence API using a sample video
    try {
      console.log('Testing Video Intelligence API...');
      // Use Google's sample video for testing
      const request = {
        inputUri: 'gs://cloud-samples-data/video/cat.mp4',
        features: ['LABEL_DETECTION']
      };
      
      console.log('Sending video analysis request...');
      const [operation] = await videoClient.annotateVideo(request);
      console.log('Analysis request successful. Operation ID:', operation.name);

      // Wait for the operation to complete
      console.log('Waiting for analysis to complete...');
      const [response] = await operation.promise();
      console.log('Analysis complete!');
      
      // Log some results
      if (response.annotationResults?.[0]?.labelAnnotations) {
        console.log('\nDetected labels:');
        response.annotationResults[0].labelAnnotations.forEach(label => {
          console.log(`- ${label.entity?.description} (confidence: ${label.confidence})`);
        });
      }

    } catch (videoError) {
      console.error('Video Intelligence API test failed:', videoError);
      throw videoError;
    }

    console.log('\nAll tests completed successfully! 🎉');
    return true;
  } catch (error) {
    console.error('\nTest failed:', error);
    return false;
  }
}

// Execute the test with proper error handling
console.log('==========================================');
console.log('Starting CommSkill Video Analysis Tests');
console.log('==========================================\n');

testVideoAnalysis()
  .then(success => {
    if (success) {
      console.log('\n✅ All tests passed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Tests failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ Test execution error:', error);
    process.exit(1);
  });