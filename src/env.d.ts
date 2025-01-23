// src/env.d.ts
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        REACT_APP_PROXY_URL: string;
        REACT_APP_CSV_URL: string;
      }
    }
  }
  
  export {};