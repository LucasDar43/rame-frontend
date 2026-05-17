import type { Metadata } from 'next';

import ProductosClient from './ProductosClient';

interface Props {
  searchParams: { categoria?: string };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const categoria = searchParams.categoria;

  if (categoria) {
    return {
      title: `${categoria} | Rame Indumentaria`,
      description: `Explorá productos de ${categoria} en Rame Indumentaria. Ropa deportiva de calidad con envíos a todo el país.`,
      alternates: {
        canonical: `https://rameindumentaria.com/productos?categoria=${categoria}`,
      },
    };
  }

  return {
    title: "Productos | Rame Indumentaria",
    description: "Descubrí toda nuestra colección de ropa deportiva para hombre y mujer. Calidad, estilo y comodidad.",
    alternates: {
      canonical: "https://rameindumentaria.com/productos",
    },
  };
}

export default function ProductosPage({ searchParams }: Props) {
  return <ProductosClient searchParams={searchParams} />;
}
