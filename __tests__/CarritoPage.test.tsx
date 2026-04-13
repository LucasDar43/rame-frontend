import { fireEvent, render, screen } from '@testing-library/react';

import CarritoPage from '@/app/carrito/page';
import useCart from '@/hooks/useCart';

jest.mock('@/hooks/useCart');

const pushMock = jest.fn();
const updateCantidadMock = jest.fn();
const removeItemMock = jest.fn();
const clearCartMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('CarritoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

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
      ],
      updateCantidad: updateCantidadMock,
      removeItem: removeItemMock,
      clearCart: clearCartMock,
      totalItems: 2,
      totalPrecio: 20000,
    });

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1400,
    });
  });

  it('renderiza productos, muestra el total y ejecuta las acciones del carrito', () => {
    render(<CarritoPage />);

    expect(screen.getByText('Remera Dry Fit')).toBeInTheDocument();
    expect(screen.getByText('2 producto(s) en tu carrito')).toBeInTheDocument();
    expect(screen.getAllByText('$20.000')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: /Aumentar cantidad de Remera Dry Fit/i }));
    expect(updateCantidadMock).toHaveBeenCalledWith(10, 3);

    fireEvent.click(screen.getByRole('button', { name: /Reducir cantidad de Remera Dry Fit/i }));
    expect(updateCantidadMock).toHaveBeenCalledWith(10, 1);

    fireEvent.click(screen.getByRole('button', { name: /Eliminar Remera Dry Fit del carrito/i }));
    expect(removeItemMock).toHaveBeenCalledWith(10);

    fireEvent.click(screen.getByRole('button', { name: /Finalizar compra/i }));
    expect(pushMock).toHaveBeenCalledWith('/checkout');

    fireEvent.click(screen.getByRole('button', { name: /Vaciar carrito/i }));
    expect(clearCartMock).toHaveBeenCalled();
  });
});
