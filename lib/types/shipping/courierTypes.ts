
export interface ShippingCartProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
    discount: number
    stock: number;
    rating: number;
    realStock?: number;
    width: number;
    height: number;
    depth: number;
}

export interface ShippingCustomerData {
    name: string;
    shippingStreet: string;
    commune: string;
    phone: string;
}

export interface ShippingDTO {
    products: ShippingCartProduct[];
    customerData: ShippingCustomerData;
}