import { ShippingCartProduct, ShippingCustomerData } from "@/lib/types/shipping/courierTypes";
import { TariffResult } from "@/lib/shipping/TariffResult";
import TariffCalculator from "@/lib/shipping/TariffCalculator";

interface RawCartPayload {
    products: RawProduct[];
    customer_data: RawCustomerData;
}

interface RawProduct {
    productId: string | number;
    price: string | number;
    quantity: string | number;
    discount: string | number;
}

interface RawCustomerData {
    name: string;
    shipping_street: string;
    commune: string;
    phone: string;
}

interface ApiProduct {
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


const API_URL = process.env.NEXT_PUBLIC_DUMMY_API_URL;


function parseCustomerData(data: RawCustomerData): ShippingCustomerData {
    return {
        name: data.name,
        shippingStreet: data.shipping_street,
        commune: data.commune,
        phone: data.phone
    };
}

async function getProductsDetails(products: RawProduct[]): Promise<ShippingCartProduct[]> {

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

function parseToShippingCartProduct(rawProduct: RawProduct, apiProduct: ApiProduct): ShippingCartProduct {
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

function addRealStockToProducts(products: ShippingCartProduct[]): ShippingCartProduct[] {
    return products.map((product) => (
        {
        ...product,
        realStock: calculateProductRealStock(product)
        }
    ));
}

function calculateProductRealStock(product: ShippingCartProduct): number {
    return Math.floor(product.stock / product.rating);
}

function printCart(cart: ShippingCartProduct[]) {
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

function verifyProductStock(products: ShippingCartProduct[]): boolean {
    for (const product of products) {
        if ((product.realStock ?? 0) < product.quantity) {
            return false;
        }
    }
    return true;
}
    


export async function POST(request: Request) {
    const body: RawCartPayload = await request.json();
    const products: RawProduct[] = body.products;
    const customerData: ShippingCustomerData = parseCustomerData(body.customer_data);
    
    const fetchedProducts = await getProductsDetails(products);
    if (fetchedProducts.length !== products.length) {
        return new Response("One or more products not found", { status: 404 });
    }

    const productsWithRealStock = addRealStockToProducts(fetchedProducts);
    printCart(productsWithRealStock);

    const isStockSufficient = verifyProductStock(productsWithRealStock);
    if (!isStockSufficient) {
        return new Response("Insufficient stock for one or more products", 
            { status: 400 }
        )
    }

    // Realizar tarificación
    const shippingDTO = {
        products: productsWithRealStock,
        customerData
    };
    const tariffResult: TariffResult = await TariffCalculator.getLowestTariff(shippingDTO);
    if (!tariffResult.available) {
        return new Response(
            "No shipping options available",
            { status: 400 }
        );
    }

    return Response.json(
        {
            courier: tariffResult.courierName,
            price: tariffResult.price,
        },
        { status: 200 }
    );
}