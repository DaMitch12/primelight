// src/utils/errorHandling.ts
export class RetryableError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'RetryableError';
    }
  }
  
  export const retryOperation = async <T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: