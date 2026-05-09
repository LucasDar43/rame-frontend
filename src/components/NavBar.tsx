'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCart from '@/hooks/useCart';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { totalItems } = useCart();
  const navItems = [
    { label: 'Mujer', href: '/productos?categoria=Mujer' },
    { label: 'Hombre', href: '/productos?categoria=Hombre' },
    { label: 'Liquidacion', href: '/productos?categoria=Liquidacion' },
    { label: 'Nosotros', href: '/#nosotros' },
  ];

  return (
    <nav className="flex h-[62px] items-center justify-between px-5 sm:px-8 lg:px-[52px]" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <Link href="/" className="whitespace-nowrap text-[12px] tracking-[3px] sm:text-[14px] sm:tracking-[4px] lg:text-[16px] lg:tracking-[5px]" style={{
        fontFamily: 'var(--font-playfair)', fontWeight: 900,
        color: 'var(--white)', textTransform: 'uppercase', textDecoration: 'none',
      }}>
        Rame Indumentaria
      </Link>

      <ul className="hidden lg:flex lg:gap-9" style={{ listStyle: 'none' }}>
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

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden sm:flex" style={{ position: 'relative', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                router.push(`/productos?q=${encodeURIComponent(search.trim())}`);
                setSearch('');
              }
            }}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              padding: '7px 36px 7px 14px', color: 'var(--white)',
              fontFamily: 'var(--font-dm-sans)', fontSize: '12px',
              outline: 'none',
            }}
            className="w-[112px] sm:w-[150px] lg:w-[180px]"
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
