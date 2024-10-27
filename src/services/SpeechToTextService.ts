// src/services/SpeechToTextService.ts
export const transcribeAudio = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
  
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };
  
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        reject(event.error);
      };
  
      recognition.start();
    });
  };