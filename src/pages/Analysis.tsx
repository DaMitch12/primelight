import React, { useState } from 'react';
import VideoRecorder from '../components/VideoRecorder';
import VideoAnalyzer from '../components/VideoAnalyzer';
import VideoUploader from '../components/VideoUploader';
import { Camera, Upload } from 'lucide-react';

const Analysis = () => {
  const [mode, setMode] = useState<'record' | 'upload' | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const handleVideoCapture = (blob: Blob) => {
    setVideoBlob(blob);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Communication Analysis
      </h1>

      {!mode && !videoBlob && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setMode('record')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Camera className="w-12 h-12 text-indigo-600 mb-4" />
            <span className="text-lg font-semibold text-gray-900">Record Video</span>
            <p className="text-sm text-gray-600 mt-2">Use your webcam to record</p>
          </button>

          <button
            onClick={() => setMode('upload')}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Upload className="w-12 h-12 text-indigo-600 mb-4" />
            <span className="text-lg font-semibold text-gray-900">Upload Video</span>
            <p className="text-sm text-gray-600 mt-2">Upload an existing video</p>
          </button>
        </div>
      )}

      {mode === 'record' && !videoBlob && (
        <VideoRecorder onVideoCapture={handleVideoCapture} onCancel={() => setMode(null)} />
      )}

      {mode === 'upload' && !videoBlob && (
        <VideoUploader onVideoSelect={handleVideoCapture} onCancel={() => setMode(null)} />
      )}

      {videoBlob && (
        <VideoAnalyzer
          videoBlob={videoBlob}
          onReset={() => {
            setVideoBlob(null);
            setMode(null);
          }}
        />
      )}
    </div>
  );
};

export default Analysis;