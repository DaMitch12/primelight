// src/components/VideoRecorder.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Square, RefreshCw, X, Loader, Upload, BarChart2, AlertCircle, CheckCircle } from 'lucide-react';
import { videoAnalysisService } from '../services/VideoAnalysisService';
import { transcribeAudio } from '../services/SpeechToTextService';

interface VideoRecorderProps {
  onAnalysisComplete: (results: any) => void;
  onCancel: () => void;
  onOpenChat?: () => void;
}

interface RealTimeMetrics {
  eyeContact: number;
  posture: number;
  gestures: number;
  voiceClarity: number;
  pace: number;
  engagement: number;
}

interface FeedbackMessage {
  type: 'success' | 'warning' | 'error';
  message: string;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ onAnalysisComplete, onCancel, onOpenChat }) => {
  // === REFS SECTION ===
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);  // New ref for stream management
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === STATE SECTION ===
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const [recordingPreview, setRecordingPreview] = useState<string>('');
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [feedback, setFeedback] = useState<FeedbackMessage[]>([]);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showCameraPrompt, setShowCameraPrompt] = useState(true);
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);

  // === CLEANUP FUNCTION === (Add this new function)
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    chunksRef.current = [];
    setIsRecording(false);
    setRecordingDuration(0);
  }, []);
 // === EFFECTS SECTION ===
 useEffect(() => {
  return () => {
    cleanup();
  };
}, [cleanup]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isRecording) {
      intervalId = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRecording]);

  useEffect(() => {
    let frameInterval: NodeJS.Timer;
    
    if (isRecording && videoRef.current) {
      frameInterval = setInterval(async () => {
        if (isProcessingFrame) return;
        await processCurrentFrame();
      }, 1000); // Process every second
    }
  
    return () => {
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [isRecording, isProcessingFrame]);

  const processCurrentFrame = async () => {
    if (!videoRef.current || isProcessingFrame) return;
    try {
      setIsProcessingFrame(true);
      
      // Capture current frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // Process frame using our service
      const metrics = await videoAnalysisService.processRealTimeFrame(imageData);
      updateMetrics(metrics);
    } catch (err) {
      console.error('Frame processing error:', err);
    } finally {
      setIsProcessingFrame(false);
    }
  };
  
  const initializeCamera = async () => {
    try {
      // Clean up any existing streams first
      cleanup();

      // Request both video and audio permissions explicitly
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Add this line right here
      console.log('Stream tracks:', stream.getTracks());

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for the video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
        
        await videoRef.current.play();
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for the video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
        
        await videoRef.current.play();
      }

      // Initialize audio context
      audioContextRef.current = new AudioContext();
      
      setIsCameraReady(true);
      setShowCameraPrompt(false);
      setError('');
    } catch (err) {
      console.error('Camera initialization error:', err);
      let errorMessage = 'Unable to access camera or microphone.';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera access denied. Please enable camera permissions and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera or microphone found. Please check your device connections.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera or microphone is already in use by another application.';
        }
      }
      
      setError(errorMessage);
      setIsCameraReady(false);
      setShowCameraPrompt(true);
    }
  };

  const startRecording = useCallback(async () => {
    if (!streamRef.current || !videoRef.current) {
      setError('Camera not initialized properly');
      return;
    }

    try {
      chunksRef.current = [];
      const options = { mimeType: 'video/webm; codecs=vp8,opus' };
      
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        throw new Error('Unsupported mime type');
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(chunksRef.current, { type: options.mimeType });
        const url = URL.createObjectURL(videoBlob);
        setRecordingPreview(url);
        setRealTimeMetrics(null);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording failed. Please try again.');
        cleanup();
      };

      mediaRecorder.start(1000); // Capture in 1-second chunks
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (err) {
      console.error('Recording start error:', err);
      setError('Failed to start recording. Please check your browser compatibility.');
      cleanup();
    }
  }, [cleanup]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Keep the camera stream active for potential re-recording
      if (streamRef.current) {
        const videoTracks = streamRef.current.getVideoTracks();
        videoTracks.forEach(track => {
          track.enabled = false; // Disable but don't stop the track
        });
      }
    }
    setShowSuccessFlash(true);
    setTimeout(() => setShowSuccessFlash(false), 3000);
}, []);

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };

  const handleRecordingStop = async () => {
    const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
    const audioBlob = await getAudioBlob();
    const url = URL.createObjectURL(videoBlob);
    setRecordingPreview(url);
    setRealTimeMetrics(null);
    stopMediaTracks();
  
    // Process audio for post-analysis using Google Cloud Speech-to-Text API
    const audioTranscript = await transcribeAudio(audioBlob);
    // Combine audio transcript with video analysis results
    // ...
  };

  const startAudioCapture = () => {
    if (!streamRef.current || !audioContextRef.current) return;

    try {
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      const processor = audioContextRef.current.createScriptProcessor(1024, 1, 1);

      processor.onaudioprocess = async (e) => {
        if (!isRecording) return;
        const audioData = e.inputBuffer.getChannelData(0);
        // Commented out for now until we implement audio processing
// const audioMetrics = await videoAnalysisService.processAudioChunk(audioData.buffer);
// updateMetrics(audioMetrics);
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
    } catch (error) {
      console.error('Audio capture error:', error);
    }
};

  const stopAudioCapture = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
};

  
const getAudioBlob = async () => {
  // This is a placeholder - implement actual audio blob extraction if needed
  return new Blob([], { type: 'audio/webm' });
};

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordingPreview(url);
      setRealTimeMetrics(null);
    }
  };

  const handleAnalysis = async () => {
    if (chunksRef.current.length === 0) {
      setError('No recording available to analyze');
      return;
    }
  
    try {
      setIsAnalyzing(true);
      setError('');
  
      const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
      const videoResults = await videoAnalysisService.analyzeVideo(videoBlob);
  
      // Update this line
      const audioTranscript = await transcribeAudio(videoBlob); // Changed from just transcribeAudio()
  
      const combinedResults = {
        video: videoResults,
        audio: {
          transcript: audioTranscript,
        },
      };
  
  
      onAnalysisComplete(combinedResults);
      if (onOpenChat) {
        onOpenChat();
      }
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const updateMetrics = (newMetrics: Partial<RealTimeMetrics>) => {
    setRealTimeMetrics(prev => ({
      ...prev as RealTimeMetrics,
      ...newMetrics
    }));
    
    if (realTimeMetrics) {
      updateFeedback(realTimeMetrics);
    }
  };
  
  const updateFeedback = (metrics: RealTimeMetrics) => {
    const newFeedback: FeedbackMessage[] = [];
  
    if (metrics.eyeContact < 70) {
      newFeedback.push({
        type: 'warning',
        message: 'Try to maintain more eye contact with the camera'
      });
    }
  
    if (metrics.posture < 70) {
      newFeedback.push({
        type: 'warning',
        message: 'Keep your shoulders back and spine straight'
      });
    }
  
    if (metrics.pace < 70 || metrics.pace > 90) {
      newFeedback.push({
        type: 'warning',
        message: 'Adjust your speaking pace - aim for a moderate speed'
      });
    }
  
    setFeedback(newFeedback);
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop a video file</p>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="video/*"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <canvas
        ref={frameCanvasRef}
        className="hidden"
        width="640"
        height="480"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Record Your Presentation</h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="relative w-full h-[480px] bg-gray-900 rounded-lg overflow-hidden mb-4">
  {showCameraPrompt ? (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-white">
      <Camera className="w-16 h-16 mb-4" />
      <button
        onClick={initializeCamera}
        className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Enable Camera
      </button>
    </div>
  ) : recordingPreview ? (
    <video
      src={recordingPreview}
      controls
      className="absolute inset-0 w-full h-full object-contain"
    />
  ) : (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="absolute inset-0 w-full h-full object-cover"
    />
  )}

            {isRecording && realTimeMetrics && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(realTimeMetrics).map(([metric, value]) => (
                    <div key={metric} className="flex justify-between">
                      <span>{metric.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={value < 70 ? 'text-red-400' : 'text-green-400'}>
                        {value.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              {!isRecording && !recordingPreview && isCameraReady && (
                <button
                  onClick={startRecording}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Recording
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording ({formatDuration(recordingDuration)})
                </button>
              )}

              {recordingPreview && (
                <>
                  <button
                    onClick={() => {
                      setRecordingPreview('');
                      initializeCamera();
                    }}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Record Again
                  </button>
                  <button
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart2 className="w-5 h-5 mr-2" />
                        Analyze Recording
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {isRecording && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse mr-2" />
                <span className="text-red-600 font-medium">Recording</span>
              </div>
            )}
          </div>

          {feedback.length > 0 && (
            <div className="mt-4 space-y-2">
              {feedback.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center space-x-2 ${
                    item.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    item.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{item.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {!realTimeMetrics ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <BarChart2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Ready for Analysis</h3>
              <p className="text-sm text-center text-gray-400 max-w-xs">
                Your AI-powered communication analysis will appear here after recording
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Real-Time Analysis</h3>
              {Object.entries(realTimeMetrics).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{value.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Success Flash Message */}
      {showSuccessFlash && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl transform scale-100 opacity-100 transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recording Complete!</h3>
              <p className="text-sm text-gray-600">Ready for analysis</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;