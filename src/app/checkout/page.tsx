'use client';

import type { CSSProperties, FormEvent } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import useCart from '@/hooks/useCart';
import { crearOrden } from '@/lib/api';
import type { OrdenRequest } from '@/types';

const EMPTY_FORM = {
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
};

type FormState = typeof EMPTY_FORM;
type FieldErrors = Partial<Record<'nombre' | 'email', string>>;

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/carrito');
    }
  }, [items.length, router]);

  const subtotal = items.reduce(
    (accumulator, item) => accumulator + item.precio * item.cantidad,
    0
  );
  const costoEnvio = subtotal < 50000 ? 3000 : 0;
  const totalFinal = subtotal + costoEnvio;
  const envioEsGratis = costoEnvio === 0;

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));

    if (field === 'nombre' || field === 'email') {
      setFieldErrors((current) => {
        if (!current[field]) {
          return current;
        }

        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const nombre = form.nombre.trim();
    const email = form.email.trim();
    const telefono = form.telefono.trim();
    const direccion = form.direccion.trim();

    const nextFieldErrors: FieldErrors = {};

    if (!nombre) {
      nextFieldErrors.nombre = 'El nombre es obligatorio.';
    }

    if (!email) {
      nextFieldErrors.email = 'El email es obligatorio.';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError('');
      return;
    }

    setFieldErrors({});
    setError('');
    setLoading(true);

    const payload: OrdenRequest & {
      costoEnvio: number;
      totalFinal: number;
    } = {
      nombreComprador: nombre,
      emailComprador: email,
      telefonoComprador: telefono || undefined,
      direccionEnvio: direccion || undefined,
      items: items.map((item) => ({
        productoId: item.productoId,
        varianteId: item.varianteId,
        cantidad: item.cantidad,
      })),
      costoEnvio,
      totalFinal,
    };

    try {
      const response = await crearOrden(payload);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lastOrderId', String(response.id));
        window.location.href = response.initPoint;
        return;
      }

      setLoading(false);
      setError('No se pudo redirigir al checkout.');
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'No se pudo procesar la orden. Intenta nuevamente.'
      );
    }
  };

  return (
    <main
      style={{
        marginTop: '62px',
        minHeight: '100vh',
        background: '#ffffff',
        padding: '52px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1180px',
          margin: '0 auto',
        }}
      >
        <section style={{ marginBottom: '40px' }}>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-playfair)',
              fontSize: '34px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: 'var(--black)',
            }}
          >
            Checkout
          </h1>

          <p
            style={{
              margin: '10px 0 0',
              fontSize: '14px',
              lineHeight: 1.7,
              color: 'var(--gray)',
              maxWidth: '560px',
            }}
          >
            Completá tus datos para generar la orden y continuar al pago.
          </p>
        </section>

        {items.length === 0 ? (
          <section
            style={{
              border: '1px solid var(--border)',
              background: 'var(--card)',
              padding: '32px',
              maxWidth: '520px',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-playfair)',
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.4px',
                color: 'var(--black)',
              }}
            >
              Tu carrito está vacío
            </h2>

            <p
              style={{
                margin: '12px 0 0',
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'var(--light)',
              }}
            >
              No hay productos para procesar en este momento. Te estamos
              redirigiendo al carrito.
            </p>

            <Link
              href="/carrito"
              style={{
                display: 'inline-block',
                marginTop: '24px',
                background: '#111111',
                color: '#ffffff',
                padding: '18px 24px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Volver al carrito
            </Link>
          </section>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'start',
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'grid',
                gap: '18px',
              }}
            >
              <Field label="Nombre" required>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(event) => handleChange('nombre', event.target.value)}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors.nombre)}
                  style={inputStyle}
                  placeholder="Tu nombre"
                  autoComplete="name"
                />
                {fieldErrors.nombre ? (
                  <span style={errorTextStyle}>{fieldErrors.nombre}</span>
                ) : null}
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors.email)}
                  style={inputStyle}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
                {fieldErrors.email ? (
                  <span style={errorTextStyle}>{fieldErrors.email}</span>
                ) : null}
              </Field>

              <Field label="Telefono">
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(event) => handleChange('telefono', event.target.value)}
                  disabled={loading}
                  style={inputStyle}
                  placeholder="Opcional"
                  autoComplete="tel"
                />
              </Field>

              <Field label="Direccion de envio">
                <input
                  type="text"
                  value={form.direccion}
                  onChange={(event) => handleChange('direccion', event.target.value)}
                  disabled={loading}
                  style={inputStyle}
                  placeholder="Opcional"
                  autoComplete="street-address"
                />
              </Field>

              {error ? <p style={errorTextStyle}>{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-dm-sans)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  border: 'none',
                  background: '#111111',
                  color: '#ffffff',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Procesando...' : 'Continuar al pago'}
              </button>
            </form>

            <aside
              style={{
                border: '1px solid var(--border)',
                background: 'var(--card)',
                padding: '28px',
                position: 'sticky',
                top: '82px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--gray)',
                }}
              >
                Resumen del pedido
              </p>

              <div
                style={{
                  marginTop: '22px',
                  display: 'grid',
                }}
              >
                {items.map((item) => {
                  const itemSubtotal = item.precio * item.cantidad;

                  return (
                    <div
                      key={item.productoId}
                      style={{
                        padding: '18px 0',
                        borderTop: '1px solid var(--border)',
                        display: 'grid',
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '16px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: 'var(--black)',
                            }}
                          >
                            {item.nombre}
                          </p>

                          <p
                            style={{
                              margin: '6px 0 0',
                              fontSize: '13px',
                              color: 'var(--gray)',
                            }}
                          >
                            Cantidad: {item.cantidad}
                          </p>
                        </div>

                        <p
                          style={{
                            margin: 0,
                            fontSize: '13px',
                            color: 'var(--light)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatPrice(item.precio)}
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '16px',
                          fontSize: '13px',
                          color: 'var(--gray)',
                        }}
                      >
                        <span>Subtotal</span>
                        <span style={{ color: 'var(--black)' }}>
                          {formatPrice(itemSubtotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  marginTop: '8px',
                  paddingTop: '18px',
                  display: 'grid',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                    fontSize: '13px',
                    color: 'var(--gray)',
                  }}
                >
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--black)' }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                    fontSize: '13px',
                    color: 'var(--gray)',
                  }}
                >
                  <span>Envío</span>
                  <span
                    style={{
                      color: envioEsGratis ? '#15803d' : 'var(--black)',
                      fontWeight: envioEsGratis ? 600 : 400,
                    }}
                  >
                    {envioEsGratis ? 'Envío gratis' : formatPrice(costoEnvio)}
                  </span>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: 'var(--black)',
                      letterSpacing: '1.5px',
                    }}
                  >
                    Total
                  </span>

                  <span
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 700,
                      fontSize: '28px',
                      color: 'var(--black)',
                      lineHeight: 1,
                    }}
                  >
                    {formatPrice(totalFinal)}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label style={{ display: 'grid', gap: '8px' }}>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--gray)',
        }}
      >
        {label} {required ? '*' : ''}
      </span>
      {children}
    </label>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  minHeight: '46px',
  padding: '12px 14px',
  border: '1px solid var(--border2)',
  outline: 'none',
  background: '#ffffff',
  color: 'var(--black)',
  fontSize: '14px',
  fontFamily: 'inherit',
};

const errorTextStyle: CSSProperties = {
  margin: 0,
  color: '#b42318',
  fontSize: '13px',
  lineHeight: 1.5,
};
