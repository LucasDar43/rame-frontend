import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import CheckoutPage from '@/app/checkout/page';
import useCart from '@/hooks/useCart';
import { crearOrden } from '@/lib/api';

jest.mock('@/hooks/useCart');
jest.mock('@/lib/api', () => ({
  crearOrden: jest.fn(),
}));

const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        href: 'http://localhost/checkout',
      },
    });

    (useCart as jest.Mock).mockReturnValue({
      items: [
        {
          productoId: 1,
          varianteId: 10,
          nombre: 'Remera Dry Fit',
          marca: 'Rame',
          imagenUrl: 'https://cdn.test/remera.jpg',
          talle: 'M',
          color: 'Negro',
          precio: 10000,
          cantidad: 2,
        },
        {
          productoId: 2,
          varianteId: 20,
          nombre: 'Short Training',
          marca: 'Rame',
          talle: 'L',
          color: 'Azul',
          precio: 5000,
          cantidad: 1,
        },
      ],
    });
  });

  it('envia el payload correcto al crear la orden', async () => {
    (crearOrden as jest.Mock).mockResolvedValue({
      id: 99,
      initPoint: 'http://localhost/pago',
    });

    render(<CheckoutPage />);

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: 'Lucia Test' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'lucia@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/Telefono/i), {
      target: { value: '1122334455' },
    });
    fireEvent.change(screen.getByLabelText(/Direccion de envio/i), {
      target: { value: 'Calle 123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continuar al pago/i }));

    await waitFor(() => {
      expect(crearOrden).toHaveBeenCalledWith({
        nombreComprador: 'Lucia Test',
        emailComprador: 'lucia@test.com',
        telefonoComprador: '1122334455',
        direccionEnvio: 'Calle 123',
        items: [
          { productoId: 1, cantidad: 2 },
          { productoId: 2, cantidad: 1 },
        ],
      });
    });

    expect(window.localStorage.getItem('lastOrderId')).toBe('99');
    expect(window.location.href).toBe('http://localhost/pago');
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
