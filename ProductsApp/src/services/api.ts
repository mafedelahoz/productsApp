import { Product, ProductsResponse, CategoriesResponse } from '../types';

const BASE_URL = 'https://dummyjson.com';

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Generic API request function with error handling
async function apiRequest<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}

// Product mappers
export const productMapper = {
  fromApi: (apiProduct: any): Product => ({
    id: apiProduct.id,
    title: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price,
    discountPercentage: apiProduct.discountPercentage,
    rating: apiProduct.rating,
    stock: apiProduct.stock,
    brand: apiProduct.brand,
    category: apiProduct.category,
    thumbnail: apiProduct.thumbnail,
    images: apiProduct.images,
  }),

  fromApiList: (apiResponse: any): ProductsResponse => ({
    products: apiResponse.products.map(productMapper.fromApi),
    total: apiResponse.total,
    skip: apiResponse.skip,
    limit: apiResponse.limit,
  }),
};

// API service class
export class ProductsApiService {
  // Get all products with optional filtering
  static async getProducts(
    skip: number = 0,
    limit: number = 20,
    category?: string,
    search?: string
  ): Promise<ProductsResponse> {
    let url = `${BASE_URL}/products?skip=${skip}&limit=${limit}`;
    
    if (category) {
      url = `${BASE_URL}/products/category/${category}?skip=${skip}&limit=${limit}`;
    } else if (search) {
      url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&skip=${skip}&limit=${limit}`;
    }
    
    const response = await apiRequest<any>(url);
    return productMapper.fromApiList(response);
  }

  // Get a single product by ID
  static async getProduct(id: number): Promise<Product> {
    const response = await apiRequest<any>(`${BASE_URL}/products/${id}`);
    return productMapper.fromApi(response);
  }

  // Get all categories
  static async getCategories(): Promise<string[]> {
    const response = await apiRequest<CategoriesResponse>(`${BASE_URL}/products/categories`);
    return response;
  }

  // Search products
  static async searchProducts(query: string, skip: number = 0, limit: number = 20): Promise<ProductsResponse> {
    const response = await apiRequest<any>(
      `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`
    );
    return productMapper.fromApiList(response);
  }
}

export { ApiError };
