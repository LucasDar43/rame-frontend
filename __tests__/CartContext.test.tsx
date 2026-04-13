import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { CartProvider } from '@/context/CartContext';
import useCart from '@/hooks/useCart';

function CartHarness() {
  const { items, addItem, removeItem, updateCantidad, totalItems, totalPrecio } = useCart();

  return (
    <div>
      <p data-testid="items">{JSON.stringify(items)}</p>
      <p>Total items: {totalItems}</p>
      <p>Total precio: {totalPrecio}</p>

      <button
        type="button"
        onClick={() =>
          addItem({
            productoId: 1,
            varianteId: 100,
            nombre: 'Remera Dry Fit',
            marca: 'Rame',
            imagenUrl: 'https://cdn.test/remera.jpg',
            talle: 'M',
            color: 'Negro',
            precio: 10000,
            cantidad: 1,
          })
        }
      >
        Agregar base
      </button>

      <button
        type="button"
        onClick={() =>
          addItem({
            productoId: 1,
            varianteId: 100,
            nombre: 'Remera Dry Fit',
            marca: 'Rame',
            imagenUrl: 'https://cdn.test/remera.jpg',
            talle: 'M',
            color: 'Negro',
            precio: 10000,
            cantidad: 2,
          })
        }
      >
        Sumar base
      </button>

      <button
        type="button"
        onClick={() =>
          addItem({
            productoId: 2,
            varianteId: 200,
            nombre: 'Short Training',
            marca: 'Rame',
            talle: 'L',
            color: 'Azul',
            precio: 5000,
            cantidad: 1,
          })
        }
      >
        Agregar otro
      </button>

      <button type="button" onClick={() => updateCantidad(100, 5)}>
        Actualizar base
      </button>

      <button type="button" onClick={() => removeItem(100)}>
        Eliminar base
      </button>
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('addItem agrega productos y suma cantidad si la variante ya existe', async () => {
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar base' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sumar base' }));
    fireEvent.click(screen.getByRole('button', { name: 'Agregar otro' }));

    await waitFor(() => {
      expect(screen.getByText('Total items: 4')).toBeInTheDocument();
    });

    expect(screen.getByText('Total precio: 35000')).toBeInTheDocument();
    expect(screen.getByTestId('items')).toHaveTextContent('"varianteId":100');
    expect(screen.getByTestId('items')).toHaveTextContent('"cantidad":3');
    expect(screen.getByTestId('items')).toHaveTextContent('"varianteId":200');
  });

  it('removeItem elimina y updateCantidad cambia la cantidad correctamente', async () => {
    render(
      <CartProvider>
        <CartHarness />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar base' }));
    fireEvent.click(screen.getByRole('button', { name: 'Agregar otro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar base' }));

    await waitFor(() => {
      expect(screen.getByText('Total items: 6')).toBeInTheDocument();
    });

    expect(screen.getByText('Total precio: 55000')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar base' }));

    await waitFor(() => {
      expect(screen.getByText('Total items: 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Total precio: 5000')).toBeInTheDocument();
    expect(screen.getByTestId('items')).not.toHaveTextContent('"varianteId":100');
  });
});
