
export interface RawCartPayload {
    products: RawProduct[];
    customer_data: RawCustomerData;
}

export interface RawProduct {
    productId: string | number;
    price: string | number;
    quantity: string | number;
    discount: string | number;
}

export interface RawCustomerData {
    name: string;
    shipping_street: string;
    commune: string;
    phone: string;
}

export interface ApiProduct {
  id: number;
  title: string;
  stock: number;
  rating: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface ApiCartResponse {
  error?: string;
  courier: string;
  price: number;
}
