import { RawCustomerData, RawProduct } from "@/lib/types/api/cart/types";
import { ShippingCartProduct, ShippingCustomerData } from "@/lib/types/shipping/CourierTypes";
import { ApiProduct } from "@/lib/types/api/cart/types";


const API_URL = process.env.NEXT_PUBLIC_DUMMY_API_URL;


export function parseCustomerData(data: RawCustomerData): ShippingCustomerData {
    return {
        name: data.name,
        shippingStreet: data.shipping_street,
        commune: data.commune,
        phone: data.phone
    };
}

export async function getProductsDetails(products: RawProduct[]): Promise<ShippingCartProduct[]> {

  const fetchedProducts: ShippingCartProduct[] = [];

  const rawProductsMap = new Map(
    products.map(p => [String(p.productId), p])
  );

  let skip = 0;
  const limit = 10;

  while (rawProductsMap.size > 0) {
    const response = await fetch(
      `${API_URL}/products?limit=${limit}&skip=${skip}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const pageData = await response.json()

    if (pageData.products.length === 0) {
      break;
    }

    for (const apiProduct of pageData.products as ApiProduct[]) {
      const id = String(apiProduct.id);
      const rawProduct = rawProductsMap.get(id);

      if (!rawProduct) continue;

      fetchedProducts.push(parseToShippingCartProduct(rawProduct, apiProduct));
      rawProductsMap.delete(id);
    }

    skip += limit;
  }

  return fetchedProducts;
}

export function parseToShippingCartProduct(rawProduct: RawProduct, apiProduct: ApiProduct): ShippingCartProduct {
    return {
        id: String(rawProduct.productId),
        name: apiProduct.title,
        price: Number(rawProduct.price),
        quantity: Number(rawProduct.quantity),
        discount: Number(rawProduct.discount),
        stock: apiProduct.stock,
        rating: apiProduct.rating,
        width: apiProduct.dimensions.width,
        height: apiProduct.dimensions.height,
        depth: apiProduct.dimensions.depth,
    };
}

export function addRealStockToProducts(products: ShippingCartProduct[]): ShippingCartProduct[] {
    return products.map((product) => (
        {
        ...product,
        realStock: calculateProductRealStock(product)
        }
    ));
}

export function calculateProductRealStock(product: ShippingCartProduct): number {
    return Math.floor(product.stock / product.rating);
}

export function printCart(cart: ShippingCartProduct[]) {
  console.table(
    cart.map(p => ({
      ID: p.id,
      Nombre: p.name,
      "Precio unitario": p.price,
      "Cantidad solicitada": p.quantity,
      "Descuento total": p.discount,
      "Stock obtenido": p.stock,
      Rating: p.rating,
      "Stock real": p.realStock ?? "N/A",
    }))
  );
}

export function verifyProductStock(products: ShippingCartProduct[]): boolean {
    for (const product of products) {
        if ((product.realStock ?? 0) < product.quantity) {
            return false;
        }
    }
    return true;
}