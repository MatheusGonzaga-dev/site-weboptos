/** Configuração de endpoints. Sobrescrevível via `window.WEBOPTOS_CONFIG` no index.html. */

type WeboptosConfig = {
  apiUrl?: string;
  sistemaUrl?: string;
  painelOnly?: boolean;
};

declare global {
  interface Window {
    WEBOPTOS_CONFIG?: WeboptosConfig;
  }
}

function fromWindow(): WeboptosConfig {
  if (typeof window === 'undefined') return {};
  return window.WEBOPTOS_CONFIG || {};
}

function isLocalHost(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1';
}

export function apiBaseUrl(): string {
  const fromCfg = fromWindow().apiUrl;
  if (fromCfg) return String(fromCfg).replace(/\/$/, '');
  const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return (isLocalHost() ? 'http://localhost:4000' : 'https://api.weboptos.com.br').replace(/\/$/, '');
}

export function sistemaBaseUrl(): string {
  const fromCfg = fromWindow().sistemaUrl;
  if (fromCfg) return String(fromCfg).replace(/\/$/, '');
  const fromEnv = (import.meta.env.VITE_SISTEMA_URL as string | undefined)?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return (isLocalHost() ? 'http://localhost:8080' : 'https://app.weboptos.com.br').replace(/\/$/, '');
}

export function painelOnly(): boolean {
  if (fromWindow().painelOnly === true) return true;
  const fromEnv = String(import.meta.env.VITE_ONBOARDING_PAINEL_ONLY ?? '').toLowerCase();
  return fromEnv === 'true' || fromEnv === '1';
}
