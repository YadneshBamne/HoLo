export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  position: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock_status: 'in_stock' | 'out_of_stock';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
  product_images?: ProductImage[];
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products?: Product;
}

export interface Favorite {
  id: string;
  product_id: string;
  created_at: string;
  products?: Product;
}

export interface LocalCartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  notes: string;
}
