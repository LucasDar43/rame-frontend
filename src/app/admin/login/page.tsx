'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, login } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/admin/productos');
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.replace('/admin/productos');
    } catch {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: 'linear-gradient(180deg, #ffffff 0%, var(--card) 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(17, 17, 17, 0.08)',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gray)',
              marginBottom: '8px',
            }}
          >
            Panel admin
          </p>
          <h1
            style={{
              fontSize: '32px',
              lineHeight: 1.1,
              color: 'var(--black)',
              fontWeight: 600,
            }}
          >
            Ingresar
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gap: '8px' }}>
            <label htmlFor="email" style={{ fontSize: '14px', color: 'var(--off-white)' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@rame.com"
              autoComplete="email"
              required
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '12px',
                border: '1px solid var(--border2)',
                padding: '0 14px',
                fontSize: '15px',
                color: 'var(--black)',
                background: '#ffffff',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <label htmlFor="password" style={{ fontSize: '14px', color: 'var(--off-white)' }}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '12px',
                border: '1px solid var(--border2)',
                padding: '0 14px',
                fontSize: '15px',
                color: 'var(--black)',
                background: '#ffffff',
                outline: 'none',
              }}
            />
          </div>

          {error ? (
            <p style={{ fontSize: '14px', color: '#b42318' }}>
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              height: '48px',
              border: 'none',
              borderRadius: '12px',
              background: 'var(--accent)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  );
}
