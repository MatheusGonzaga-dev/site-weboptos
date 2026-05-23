/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SISTEMA_URL?: string;
  readonly VITE_ONBOARDING_PAINEL_ONLY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
