import { Product, SortOption } from '../types';

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'rating-asc':
      return sortedProducts.sort((a, b) => a.rating - b.rating);
    case 'rating-desc':
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    default:
      return sortedProducts;
  }
};

export const getSortOptionLabel = (sortBy: SortOption): string => {
  switch (sortBy) {
    case 'price-asc':
      return 'Price: Low to High';
    case 'price-desc':
      return 'Price: High to Low';
    case 'rating-asc':
      return 'Rating: Low to High';
    case 'rating-desc':
      return 'Rating: High to Low';
    default:
      return 'Default';
  }
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};
