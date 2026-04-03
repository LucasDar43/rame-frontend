import { getProducto, getVariantes } from '@/lib/api';
import ProductoDetalle from '@/components/producto/ProductoDetalle';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function ProductoPage({ params }: Props) {
  try {
    const producto = await getProducto(Number(params.id));
    const variantes = await getVariantes(Number(params.id));
    return <ProductoDetalle producto={producto} variantes={variantes} />;
  } catch (error) {
    notFound();
  }
}