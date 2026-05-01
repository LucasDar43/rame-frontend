'use client';

import type { CSSProperties, FormEvent } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import useCart from '@/hooks/useCart';
import { calcularEnvio, crearOrden } from '@/lib/api';
import type { EnvioResponse, OrdenRequest } from '@/types';

const EMPTY_FORM = {
  nombre: '',
  email: '',
  telefono: '',
  calle: '',
  numero: '',
  pisoDpto: '',
  codigoPostal: '',
  ciudad: '',
  provincia: '',
};

type FormState = typeof EMPTY_FORM;
type FieldErrors = Partial<Record<
  'nombre' | 'email' | 'telefono' | 'calle' | 'numero' | 'codigoPostal' | 'ciudad' | 'provincia',
  string
>>;

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
  const [envioInfo, setEnvioInfo] = useState<EnvioResponse | null>(null);
  const [envioLoading, setEnvioLoading] = useState(false);
  const [codigoPostalConsultado, setCodigoPostalConsultado] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/carrito');
    }
  }, [items.length, router]);

  useEffect(() => {
    if (form.codigoPostal.length >= 4) {
      calcularCostoEnvio(form.codigoPostal);
    } else {
      setEnvioInfo(null);
      setCodigoPostalConsultado('');
    }
  }, [form.codigoPostal]);

  const subtotal = items.reduce(
    (accumulator, item) => accumulator + item.precio * item.cantidad,
    0
  );
  const costoEnvio = envioInfo?.costo ?? (subtotal < 80000 ? 3500 : 0);
  const totalFinal = subtotal + costoEnvio;
  const envioEsGratis = costoEnvio === 0;

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field as keyof FieldErrors]) return current;
      const next = { ...current };
      delete next[field as keyof FieldErrors];
      return next;
    });
  };

  const calcularCostoEnvio = async (cp: string) => {
    if (cp.length < 4) return;
    if (cp === codigoPostalConsultado) return;
    setEnvioLoading(true);
    try {
      const info = await calcularEnvio(cp, subtotal);
      setEnvioInfo(info);
      setCodigoPostalConsultado(cp);
    } catch {
      setEnvioInfo(null);
    } finally {
      setEnvioLoading(false);
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
    const calle = form.calle.trim();
    const numero = form.numero.trim();
    const ciudad = form.ciudad.trim();
    const provincia = form.provincia.trim();
    const codigoPostal = form.codigoPostal.trim();

    const nextFieldErrors: FieldErrors = {};

    if (!nombre) {
      nextFieldErrors.nombre = 'El nombre es obligatorio.';
    }
    if (!email) {
      nextFieldErrors.email = 'El email es obligatorio.';
    }
    if (!telefono) {
      nextFieldErrors.telefono = 'El teléfono es obligatorio.';
    }
    if (!calle) {
      nextFieldErrors.calle = 'La calle es obligatoria.';
    }
    if (!numero) {
      nextFieldErrors.numero = 'El número es obligatorio.';
    }
    if (!codigoPostal) {
      nextFieldErrors.codigoPostal = 'El código postal es obligatorio.';
    } else if (codigoPostal.length < 4) {
      nextFieldErrors.codigoPostal = 'El código postal no es válido.';
    } else if (!envioInfo) {
      nextFieldErrors.codigoPostal = 'Esperá mientras se calcula el envío.';
    }
    if (!ciudad) {
      nextFieldErrors.ciudad = 'La ciudad es obligatoria.';
    }
    if (!provincia) {
      nextFieldErrors.provincia = 'La provincia es obligatoria.';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError('');
      return;
    }

    setFieldErrors({});
    setError('');
    setLoading(true);

    const payload: OrdenRequest = {
      nombreComprador: nombre,
      emailComprador: email,
      telefonoComprador: telefono || undefined,
      direccionEnvio: calle || undefined,
      numeroDireccion: numero || undefined,
      pisoDpto: form.pisoDpto.trim() || undefined,
      codigoPostal: codigoPostal || undefined,
      ciudadEnvio: ciudad || undefined,
      provinciaEnvio: provincia || undefined,
      items: items.map((item) => ({
        productoId: item.productoId,
        varianteId: item.varianteId,
        cantidad: item.cantidad,
      })),
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

              <Field label="Telefono" required={true}>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(event) => handleChange('telefono', event.target.value)}
                  disabled={loading}
                  style={inputStyle}
                  placeholder="Opcional"
                  autoComplete="tel"
                />
                {fieldErrors.telefono ? (
                  <span style={errorTextStyle}>{fieldErrors.telefono}</span>
                ) : null}
              </Field>

              <Field label="Calle" required={true}>
                <input
                  type="text"
                  value={form.calle}
                  onChange={(event) => handleChange('calle', event.target.value)}
                  disabled={loading}
                  style={inputStyle}
                  placeholder="Nombre de la calle"
                  autoComplete="address-line1"
                />
                {fieldErrors.calle ? (
                  <span style={errorTextStyle}>{fieldErrors.calle}</span>
                ) : null}
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Numero" required={true}>
                  <input
                    type="text"
                    value={form.numero}
                    onChange={(event) => handleChange('numero', event.target.value)}
                    disabled={loading}
                    style={inputStyle}
                    placeholder="1234"
                  />
                  {fieldErrors.numero ? (
                    <span style={errorTextStyle}>{fieldErrors.numero}</span>
                  ) : null}
                </Field>

                <Field label="Piso / Depto">
                  <input
                    type="text"
                    value={form.pisoDpto}
                    onChange={(event) => handleChange('pisoDpto', event.target.value)}
                    disabled={loading}
                    style={inputStyle}
                    placeholder="Opcional"
                  />
                </Field>
              </div>

              <Field label="Codigo postal" required={true}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={form.codigoPostal}
                    onChange={(event) => {
                      const val = event.target.value.replace(/\D/g, '').slice(0, 8);
                      handleChange('codigoPostal', val);
                    }}
                    onBlur={() => calcularCostoEnvio(form.codigoPostal)}
                    disabled={loading}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="Ej. 3350"
                    autoComplete="postal-code"
                  />
                  <button
                    type="button"
                    onClick={() => calcularCostoEnvio(form.codigoPostal)}
                    disabled={form.codigoPostal.length < 4 || envioLoading || loading}
                    style={{
                      height: '46px',
                      padding: '0 16px',
                      border: 'none',
                      background: form.codigoPostal.length >= 4 ? 'var(--accent)' : '#cccccc',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: form.codigoPostal.length >= 4 ? 'pointer' : 'not-allowed',
                      fontFamily: 'var(--font-dm-sans)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {envioLoading ? '...' : 'Calcular'}
                  </button>
                </div>
                {fieldErrors.codigoPostal ? (
                  <span style={errorTextStyle}>{fieldErrors.codigoPostal}</span>
                ) : null}
                {envioInfo && !envioLoading && (
                  <p style={{
                    margin: '6px 0 0',
                    fontSize: '12px',
                    color: envioInfo.costo === 0 ? '#027a48' : 'var(--gray)',
                  }}>
                    {envioInfo.costo === 0
                      ? 'Envio gratis'
                      : `$${envioInfo.costo.toLocaleString('es-AR')} — ${envioInfo.descripcion}`}
                  </p>
                )}
              </Field>

              <Field label="Ciudad" required={true}>
                <input
                  type="text"
                  value={form.ciudad}
                  onChange={(event) => handleChange('ciudad', event.target.value)}
                  disabled={loading}
                  style={inputStyle}
                  placeholder="Ej. Vera"
                  autoComplete="address-level2"
                />
                {fieldErrors.ciudad ? (
                  <span style={errorTextStyle}>{fieldErrors.ciudad}</span>
                ) : null}
              </Field>

              <Field label="Provincia" required={true}>
                <input
                  type="text"
                  value={form.provincia}
                  onChange={(event) => handleChange('provincia', event.target.value)}
                  disabled={loading}
                  style={inputStyle}
                  placeholder="Ej. Santa Fe"
                  autoComplete="address-level1"
                />
                {fieldErrors.provincia ? (
                  <span style={errorTextStyle}>{fieldErrors.provincia}</span>
                ) : null}
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

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  fontSize: '13px',
                  color: 'var(--gray)',
                }}>
                  <span>Envio</span>
                  <span style={{
                    color: envioEsGratis ? '#15803d' : 'var(--black)',
                    fontWeight: envioEsGratis ? 600 : 400,
                  }}>
                    {envioLoading
                      ? 'Calculando...'
                      : envioEsGratis
                      ? 'Envio gratis'
                      : envioInfo
                      ? `$${costoEnvio.toLocaleString('es-AR')}`
                      : 'Ingresa tu CP'}
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
