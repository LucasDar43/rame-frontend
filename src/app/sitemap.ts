import type { MetadataRoute } from "next";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://rameindumentaria.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface SitemapProducto {
  id: number;
  fechaCreacion?: string;
}

async function getProductos() {
  try {
    const res = await fetch(`${API_URL}/productos?size=1000`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error fetching productos for sitemap:", res.status);
      return [];
    }

    const data = await res.json();
    return data.content || [];
  } catch (error) {
    console.error("Error fetching productos for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productos = await getProductos();

  const productosUrls = productos.map((producto: SitemapProducto) => ({
    url: `${FRONTEND_URL}/productos/${producto.id}`,
    lastModified: new Date(producto.fechaCreacion || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: FRONTEND_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${FRONTEND_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${FRONTEND_URL}/productos?categoria=Mujer`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${FRONTEND_URL}/productos?categoria=Hombre`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${FRONTEND_URL}/productos?categoria=Liquidacion`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${FRONTEND_URL}/como-comprar`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${FRONTEND_URL}/envios-y-zonas`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${FRONTEND_URL}/preguntas-frecuentes`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${FRONTEND_URL}/cambios`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...productosUrls,
  ];
}
