// server/src/services/videoAnalysisService.ts

private async calculateEyeContact(results: any): Promise<number> {
  try {
    const faceDetections = results.faceAnnotations || [];
    let totalConfidence = 0;
    let frames = 0;

    faceDetections.forEach((face: any) => {
      if (face.frames) {
        face.frames.forEach((frame: any) => {
          // Check if eyes are visible and facing camera
          const lookingAtCamera = this.isLookingAtCamera(frame.landmarks);
          if (lookingAtCamera) {
            totalConfidence += frame.detectionConfidence;
          }
          frames++;
        });
      }
    });

    return frames > 0 ? (totalConfidence / frames) * 100 : 0;
  } catch (error) {
    console.error('Eye contact calculation error:', error);
    return 0;
  }
}

private async calculatePosture(results: any): Promise<number> {
  try {
    const poseDetections = results.poseAnnotations || [];
    let posturScore = 0;
    let frames = 0;

    poseDetections.forEach((pose: any) => {
      if (pose.landmarks) {
        // Check shoulder alignment and spine straightness
        const shoulderScore = this.checkShoulderAlignment(pose.landmarks);
        const spineScore = this.checkSpineAlignment(pose.landmarks);
        posturScore += (shoulderScore + spineScore) / 2;
        frames++;
      }
    });

    return frames > 0 ? (posturScore / frames) * 100 : 0;
  } catch (error) {
    console.error('Posture calculation error:', error);
    return 0;
  }
}

private async calculateGestures(results: any): Promise<number> {
  try {
    const poseDetections = results.poseAnnotations || [];
    let gestureScore = 0;
    let totalFrames = poseDetections.length;
    let previousPose = null;

    poseDetections.forEach((pose: any) => {
      if (previousPose) {
        // Detect meaningful hand movements
        const handMovement = this.calculateHandMovement(pose, previousPose);
        // Check if gesture is natural and purposeful
        const gestureQuality = this.evaluateGestureQuality(pose);
        gestureScore += (handMovement + gestureQuality) / 2;
      }
      previousPose = pose;
    });

    return totalFrames > 0 ? (gestureScore / (totalFrames - 1)) * 100 : 0;
  } catch (error) {
    console.error('Gesture calculation error:', error);
    return 0;
  }
}

private async analyzeVoice(results: any): Promise<number> {
  try {
    const speechResults = results.speechTranscriptions || [];
    let clarityScore = 0;
    let segments = 0;

    speechResults.forEach((transcription: any) => {
      if (transcription.alternatives && transcription.alternatives.length > 0) {
        const alternative = transcription.alternatives[0];
        
        // Combine multiple factors for voice clarity
        const confidence = alternative.confidence || 0;
        const pronunciation = this.analyzePronunciation(alternative.words);
        const volume = this.analyzeVolume(alternative.words);
        
        clarityScore += (confidence + pronunciation + volume) / 3;
        segments++;
      }
    });

    return segments > 0 ? (clarityScore / segments) * 100 : 0;
  } catch (error) {
    console.error('Voice analysis error:', error);
    return 0;
  }
}

private async calculatePace(results: any): Promise<number> {
  try {
    const speechResults = results.speechTranscriptions || [];
    let paceScore = 0;
    let segments = 0;

    speechResults.forEach((transcription: any) => {
      if (transcription.alternatives && transcription.alternatives.length > 0) {
        const alternative = transcription.alternatives[0];
        if (alternative.words) {
          // Calculate words per minute
          const duration = this.calculateDuration(alternative.words);
          const wordCount = alternative.words.length;
          const wpm = (wordCount / duration) * 60;
          
          // Score based on ideal range (120-160 wpm)
          paceScore += this.scoreSpeakingPace(wpm);
          segments++;
        }
      }
    });

    return segments > 0 ? (paceScore / segments) * 100 : 0;
  } catch (error) {
    console.error('Pace calculation error:', error);
    return 0;
  }
}

private async calculateEngagement(results: any): Promise<number> {
  try {
    // Weighted combination of all metrics
    const eyeContact = await this.calculateEyeContact(results);
    const posture = await this.calculatePosture(results);
    const gestures = await this.calculateGestures(results);
    const voiceClarity = await this.analyzeVoice(results);
    const pace = await this.calculatePace(results);

    const weights = {
      eyeContact: 0.25,
      posture: 0.15,
      gestures: 0.20,
      voiceClarity: 0.25,
      pace: 0.15
    };

    return (
      eyeContact * weights.eyeContact +
      posture * weights.posture +
      gestures * weights.gestures +
      voiceClarity * weights.voiceClarity +
      pace * weights.pace
    );
  } catch (error) {
    console.error('Engagement calculation error:', error);
    return 0;
  }
}

// Helper methods for detailed analysis
private isLookingAtCamera(landmarks: any[]): boolean {
  // Implement eye direction detection logic
  return true; // Placeholder
}

private checkShoulderAlignment(landmarks: any[]): number {
  // Implement shoulder alignment check
  return 0.8; // Placeholder
}

private checkSpineAlignment(landmarks: any[]): number {
  // Implement spine alignment check
  return 0.85; // Placeholder
}

private calculateHandMovement(currentPose: any, previousPose: any): number {
  // Implement hand movement detection
  return 0.75; // Placeholder
}

private evaluateGestureQuality(pose: any): number {
  // Implement gesture quality evaluation
  return 0.8; // Placeholder
}

private analyzePronunciation(words: any[]): number {
  // Implement pronunciation analysis
  return 0.9; // Placeholder
}

private analyzeVolume(words: any[]): number {
  // Implement volume analysis
  return 0.85; // Placeholder
}

private calculateDuration(words: any[]): number {
  // Calculate duration between first and last word
  const start = words[0]?.startTime?.seconds || 0;
  const end = words[words.length - 1]?.endTime?.seconds || 0;
  return end - start;
}

private scoreSpeakingPace(wpm: number): number {
  // Score based on ideal speaking pace (120-160 wpm)
  const idealMin = 120;
  const idealMax = 160;
  
  if (wpm >= idealMin && wpm <= idealMax) {
    return 1.0;
  } else if (wpm < idealMin) {
    return 0.5 + (wpm / idealMin) * 0.5;
  } else {
    return 0.5 + ((200 - wpm) / (200 - idealMax)) * 0.5;
  }
}