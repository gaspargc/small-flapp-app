
export interface CartProduct {
    id: string;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedTotal: number;
    thumbnail: string;
};

export interface Cart {
    id: string;
    products: CartProduct[];
    total: number;
    discountedTotal: number;
    userId: string;
    totalProducts: number;
    totalQuantity: number;
};

