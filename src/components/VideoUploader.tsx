import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelect: (blob: Blob) => void;
  onCancel: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelect, onCancel }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return false;
    }
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setError('File size must be less than 100MB');
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onVideoSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onVideoSelect(file);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form
        className={`relative ${
          dragActive ? 'bg-indigo-50' : 'bg-gray-50'
        } p-8 rounded-lg border-2 border-dashed border-gray-300 transition-colors`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Drag and drop your video here
          </p>
          <p className="mt-2 text-gray-500">or</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Select Video
          </button>
          {error && (
            <p className="mt-4 text-red-600">{error}</p>
          )}
        </div>
      </form>

      <div className="mt-4 flex justify-center">
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VideoUploader;