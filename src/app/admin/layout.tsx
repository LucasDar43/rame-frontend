'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

type AdminLayoutProps = {
  children: React.ReactNode;
};

type SidebarItemProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

function SidebarItem({ active, label, onClick }: SidebarItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'block',
        width: '100%',
        border: 'none',
        borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
        textAlign: 'left',
        background: active || hovered ? 'var(--card)' : 'transparent',
        fontWeight: active ? 600 : 400,
        padding: '10px 12px',
        marginBottom: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        color: 'var(--black)',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isProductosActive = pathname.includes('/admin/productos');
  const isOrdenesActive = pathname.includes('/admin/ordenes');

  return (
    <aside
      style={{
        width: '240px',
        borderRight: '1px solid var(--border)',
        background: '#ffffff',
        padding: '24px 16px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '32px',
          color: 'var(--black)',
        }}
      >
        Admin
      </div>

      <nav role="navigation" aria-label="Admin navigation">
        <SidebarItem
          active={isProductosActive}
          label="Productos"
          onClick={() => router.push('/admin/productos')}
        />
        <SidebarItem
          active={isOrdenesActive}
          label="Órdenes"
          onClick={() => router.push('/admin/ordenes')}
        />
      </nav>
    </aside>
  );
}

function AuthLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'grid',
          justifyItems: 'center',
          gap: '12px',
          color: 'var(--black)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '999px',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: 'var(--gray)',
          }}
        >
          Cargando panel...
        </p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const isLoginRoute = pathname === '/admin/login';

  useEffect(() => {
    const authenticated = isAuthenticated();

    if (!authenticated && !isLoginRoute) {
      setCheckingAuth(false);
      router.replace('/admin/login');
    } else if (authenticated && isLoginRoute) {
      setCheckingAuth(false);
      router.replace('/admin/productos');
    } else {
      setCheckingAuth(false);
    }
  }, [isLoginRoute, pathname, router]);

  if (checkingAuth) {
    return <AuthLoader />;
  }

  if (isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
