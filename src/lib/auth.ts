const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

type LoginResponse = {
  token: string;
  email: string;
  rol: string;
};

type User = {
  email: string;
  rol: string;
};

const TOKEN_KEY = 'token';
const EMAIL_KEY = 'email';
const ROLE_KEY = 'rol';

function canUseStorage() {
  return typeof window !== 'undefined';
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Email o contraseña incorrectos');
  }

  const data: LoginResponse = await response.json();

  if (canUseStorage()) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(EMAIL_KEY, data.email);
    localStorage.setItem(ROLE_KEY, data.rol);
  }

  return data;
}

export function logout(): void {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getToken(): string | null {
  if (!canUseStorage()) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export async function verificarSesion(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function getUser(): User | null {
  if (!canUseStorage()) {
    return null;
  }

  const email = localStorage.getItem(EMAIL_KEY);
  const rol = localStorage.getItem(ROLE_KEY);

  if (!email || !rol) {
    return null;
  }

  return { email, rol };
}

export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expMs = payload.exp * 1000;
    return Date.now() >= expMs;
  } catch {
    return true;
  }
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.rol === 'ADMIN';
}

export function isAuthenticatedAndValid(): boolean {
  return isAuthenticated() && !isTokenExpired() && isAdmin();
}
