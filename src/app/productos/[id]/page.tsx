import { getProducto, getVariantes } from '@/lib/api';
import ProductoDetalle from '@/components/producto/ProductoDetalle';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const producto = await getProducto(Number(params.id));

    const title = `${producto.nombre} | Rame Indumentaria`;
    const description = producto.descripcion?.slice(0, 160) || `${producto.nombre} - Ropa deportiva de calidad`;

    let imageUrl = 'https://rameindumentaria.com/logo.png';
    if (producto.imagenUrl) {
      imageUrl = producto.imagenUrl;
    } else if (producto.imagenes && producto.imagenes.length > 0) {
      imageUrl = producto.imagenes[0].url;
    }

    return {
      title,
      description,
      alternates: {
        canonical: `https://rameindumentaria.com/productos/${params.id}`,
      },
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Producto | Rame Indumentaria",
      description: "Ropa deportiva de calidad",
    };
  }
}

export default async function ProductoPage({ params }: Props) {
  try {
    const producto = await getProducto(Number(params.id));
    const variantes = await getVariantes(Number(params.id));
    return <ProductoDetalle producto={producto} variantes={variantes} />;
  } catch {
    notFound();
  }
}
