// src/components/TestVideo.tsx
import React, { useState } from 'react';
import { videoAnalysisService } from '../services/VideoAnalysisService';

const TestVideo = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    try {
      setLoading(true);
      // For now, just test the mock analysis
      const results = await videoAnalysisService.mockAnalysis();
      setResult(results);
      console.log('Test results:', results);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Video Analysis Test</h2>
      <button
        onClick={handleTest}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Test'}
      </button>

      {result && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Results:</h3>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestVideo;