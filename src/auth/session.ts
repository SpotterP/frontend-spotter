import type { User } from '../types';

const KEY = 'spotter.session';

export interface Session {
  token: string;
  refreshToken: string;
  user: User;
}

type Listener = (session: Session | null) => void;
const listeners = new Set<Listener>();

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  } catch {
    /* empty */
  }
  listeners.forEach((listener) => listener(session));
}

export function subscribeSession(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
