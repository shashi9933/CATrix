declare module 'react-dom/client' {
  import { ReactElement } from 'react';
  
  export interface Root {
    render(element: ReactElement): void;
    unmount(): void;
  }
  
  export function createRoot(container: Element | DocumentFragment): Root;
}
