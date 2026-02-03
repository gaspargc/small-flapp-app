import { ShippingCustomerData } from "@/lib/types/shipping/CourierTypes";
import TariffCalculator from "@/lib/shipping/TariffCalculator";
import { RawCartPayload, RawProduct } from "@/lib/types/api/cart/types";
import { 
    parseCustomerData,
    getProductsDetails,
    verifyProductStock,
    addRealStockToProducts,
    printCart
} from "@/lib/types/api/cart/cartUtils";


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

    const shippingDTO = {
        products: productsWithRealStock,
        customerData
    };
    const tariffResult = await TariffCalculator.getLowestTariff(shippingDTO);

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