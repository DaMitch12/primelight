import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { RefreshCw } from 'lucide-react';

interface VideoAnalyzerProps {
  videoBlob: Blob;
  onReset: () => void;
}

interface AnalysisMetrics {
  eyeContact: number;
  posture: number;
  gestures: number;
}

const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({ videoBlob, onReset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [metrics, setMetrics] = useState<AnalysisMetrics | null>(null);
  const [loadingStatus, setLoadingStatus] = useState('Loading models...');

  useEffect(() => {
    const videoUrl = URL.createObjectURL(videoBlob);
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
    }
    initializeAnalysis();
    return () => URL.revokeObjectURL(videoUrl);
  }, [videoBlob]);

  const initializeAnalysis = async () => {
    try {
      await tf.ready();
      setLoadingStatus('Loading face detection model...');
      const faceModel = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );

      setLoadingStatus('Loading pose detection model...');
      const poseModel = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet
      );

      setLoadingStatus('Analyzing video...');
      await analyzeVideo(faceModel, poseModel);
      
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error during analysis:', error);
      setLoadingStatus('Error loading models. Please try again.');
    }
  };

  const analyzeVideo = async (faceModel: any, poseModel: any) => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;
    let eyeContactFrames = 0;
    let goodPostureFrames = 0;
    let gestureFrames = 0;

    video.addEventListener('play', async () => {
      const processFrame = async () => {
        if (video.paused || video.ended) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const faces = await faceModel.estimateFaces({
          input: canvas
        });
        
        const poses = await poseModel.estimatePoses(canvas);

        // Analyze face direction for eye contact
        if (faces.length > 0) {
          const face = faces[0];
          if (isLookingAtCamera(face)) {
            eyeContactFrames++;
          }
        }

        // Analyze pose for posture
        if (poses.length > 0) {
          const pose = poses[0];
          if (hasGoodPosture(pose)) {
            goodPostureFrames++;
          }
          if (hasEngagingGestures(pose)) {
            gestureFrames++;
          }
        }

        frameCount++;

        // Update metrics every 30 frames
        if (frameCount % 30 === 0) {
          setMetrics({
            eyeContact: (eyeContactFrames / frameCount) * 100,
            posture: (goodPostureFrames / frameCount) * 100,
            gestures: (gestureFrames / frameCount) * 100
          });
        }

        requestAnimationFrame(processFrame);
      };

      processFrame();
    });

    video.play();
  };

  const isLookingAtCamera = (face: any) => {
    // Simplified check - in reality, would use more sophisticated geometry
    return true; // Placeholder
  };

  const hasGoodPosture = (pose: any) => {
    // Simplified check - in reality, would check shoulder alignment, etc.
    return true; // Placeholder
  };

  const hasEngagingGestures = (pose: any) => {
    // Simplified check - in reality, would analyze movement patterns
    return true; // Placeholder
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <video
          ref={videoRef}
          className="w-full rounded-lg"
          playsInline
          controls
        />
        <canvas
          ref={canvasRef}
          className="hidden"
          width="640"
          height="480"
        />
      </div>

      {isAnalyzing ? (
        <div className="text-center p-4">
          <RefreshCw className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">{loadingStatus}</p>
        </div>
      ) : metrics && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Eye Contact</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {Math.round(metrics.eyeContact)}%
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Posture</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {Math.round(metrics.posture)}%
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Gestures</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {Math.round(metrics.gestures)}%
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Record Another Video
        </button>
      </div>
    </div>
  );
};

export default VideoAnalyzer;