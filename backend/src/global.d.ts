// Temporary global type declarations to satisfy Render TypeScript environment
declare module 'express';
declare module 'cors';
declare module 'jsonwebtoken';

declare const console: any;
declare const process: any;

// Allow any imports for .js files without types
declare module '*';

export {};
