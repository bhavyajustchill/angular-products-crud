export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  expiry?: string;
  location: string;
}
