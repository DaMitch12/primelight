// src/pages/Record.tsx
import React from 'react';
import VideoRecorder from '../components/VideoRecorder';

const Record = () => {
  const handleAnalysisComplete = (results: any) => {
    console.log('Analysis results:', results);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Record Session</h1>
      <VideoRecorder 
        onAnalysisComplete={handleAnalysisComplete}
        onCancel={() => console.log('Recording cancelled')}
      />
    </div>
  );
};

export default Record;