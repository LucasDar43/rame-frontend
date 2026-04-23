'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getOrden } from '@/lib/api';
import type { OrdenResponse } from '@/types';

type UseOrdenStatusOptions = {
  enablePolling?: boolean;
  maxAttempts?: number;
  intervalMs?: number;
};

type UseOrdenStatusResult = {
  orden: OrdenResponse | null;
  loading: boolean;
  error: string | null;
  pollingActivo: boolean;
  intentos: number;
  refetch: () => void;
};

const IDLE_REFETCH = () => {};

export function useOrdenStatus(
  ordenId: number | null,
  options?: UseOrdenStatusOptions
): UseOrdenStatusResult {
  const enablePolling = options?.enablePolling ?? false;
  const maxAttempts = options?.maxAttempts ?? 5;
  const intervalMs = options?.intervalMs ?? 2000;

  const [orden, setOrden] = useState<OrdenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingActivo, setPollingActivo] = useState(false);
  const [intentos, setIntentos] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(true);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const fetchOrden = useCallback(
    async (attempt = 0, resetAttempts = false) => {
      if (ordenId === null || !activeRef.current) {
        return;
      }

      clearTimer();

      if (activeRef.current) {
        setLoading(true);
        setError(null);
        setPollingActivo(enablePolling && attempt > 0);
        if (resetAttempts) {
          setIntentos(0);
        } else {
          setIntentos(attempt);
        }
      }

      try {
        const response = await getOrden(ordenId);

        if (!activeRef.current) {
          return;
        }

        setOrden(response);
        setLoading(false);

        if (enablePolling && response.estado === 'PENDIENTE' && attempt < maxAttempts) {
          setPollingActivo(true);
          timeoutRef.current = setTimeout(() => {
            void fetchOrden(attempt + 1);
          }, intervalMs);
          return;
        }

        setPollingActivo(false);
      } catch (err) {
        if (!activeRef.current) {
          return;
        }

        setLoading(false);
        setPollingActivo(false);
        setError(
          err instanceof Error && err.message
            ? err.message
            : 'No se pudo obtener el estado de la orden.'
        );
      }
    },
    [clearTimer, enablePolling, intervalMs, maxAttempts, ordenId]
  );

  const refetch = useCallback(() => {
    if (ordenId === null) {
      return;
    }

    void fetchOrden(0, true);
  }, [fetchOrden, ordenId]);

  useEffect(() => {
    activeRef.current = true;

    if (ordenId === null) {
      setOrden(null);
      setLoading(false);
      setError(null);
      setPollingActivo(false);
      setIntentos(0);
      return () => {
        activeRef.current = false;
        clearTimer();
      };
    }

    void fetchOrden(0, true);

    return () => {
      activeRef.current = false;
      clearTimer();
    };
  }, [clearTimer, fetchOrden, ordenId]);

  if (ordenId === null) {
    return {
      orden: null,
      loading: false,
      error: null,
      pollingActivo: false,
      intentos: 0,
      refetch: IDLE_REFETCH,
    };
  }

  return {
    orden,
    loading,
    error,
    pollingActivo,
    intentos,
    refetch,
  };
}
