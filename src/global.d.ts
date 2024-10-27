// src/global.d.ts
declare module 'buffer' {
    export const Buffer: {
      from(data: any, encoding?: string): Buffer;
      // Add any other Buffer methods you are using
    };
  }