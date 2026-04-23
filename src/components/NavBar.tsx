'use client';

import { useState } from 'react';
import Link from 'next/link';
import useCart from '@/hooks/useCart';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const { totalItems } = useCart();
  const navItems = [
    { label: 'Mujer', href: '/productos?categoria=Mujer' },
    { label: 'Hombre', href: '/productos?categoria=Hombre' },
    { label: 'Liquidacion', href: '/productos?categoria=Liquidacion' },
    { label: 'Nosotros', href: '/#nosotros' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '62px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 52px',
      background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <Link href="/" style={{
        fontFamily: 'var(--font-playfair)', fontWeight: 900,
        fontSize: '16px', letterSpacing: '5px',
        color: 'var(--white)', textTransform: 'uppercase', textDecoration: 'none',
      }}>
        Rame Indumentaria
      </Link>

      <ul style={{ display: 'flex', gap: '36px', listStyle: 'none' }}>
        {navItems.map((item) => (
          <li key={item.label}>
            <Link href={item.href} style={{
              fontSize: '11px', fontWeight: 500, letterSpacing: '2.5px',
              textTransform: 'uppercase', color: 'var(--light)',
              textDecoration: 'none',
            }}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              padding: '7px 36px 7px 14px', color: 'var(--white)',
              fontFamily: 'var(--font-dm-sans)', fontSize: '12px',
              width: '180px', outline: 'none',
            }}
          />
          <svg style={{ position: 'absolute', right: '10px', color: 'var(--gray)' }}
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>

        <Link href="/carrito" style={{ position: 'relative', display: 'flex', textDecoration: 'none' }}>
          <div style={{
            position: 'relative', background: 'transparent',
            border: '1px solid var(--border)', color: 'var(--light)',
            width: '38px', height: '38px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--accent)',
                color: '#ffffff',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '999px',
              }}>{totalItems}</span>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}
