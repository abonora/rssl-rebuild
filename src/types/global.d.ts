// src/types/global.d.ts
export {}; // ensures this file is treated as a module

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}
