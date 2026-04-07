'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const authenticated = isAuthenticated();
    const isLoginRoute = pathname === '/admin/login';

    if (!authenticated && !isLoginRoute) {
      router.replace('/admin/login');
    } else if (authenticated && isLoginRoute) {
      router.replace('/admin/productos');
    } else {
      setCheckingAuth(false);
    }
  }, [pathname, router]);

  if (checkingAuth) {
    return null;
  }

  return <>{children}</>;
}
