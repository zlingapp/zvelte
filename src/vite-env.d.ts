/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/svelte" />
declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
      onclick_outside: () => void
    }
  }
  
declare const ZLING_VERSION: string;