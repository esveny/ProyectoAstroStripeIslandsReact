import type { Product } from './types';
import productsData from '../content/products.json';

const products: Product[] = productsData;

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getFeaturedProducts(limit: number = 8): Product[] {
  return products.slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function filterProductsByTag(tag: string): Product[] {
  return products.filter(product => product.tags.includes(tag));
}

export function sortProducts(products: Product[], sortBy: 'price-asc' | 'price-desc' | 'name'): Product[] {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  products.forEach(product => {
    product.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}