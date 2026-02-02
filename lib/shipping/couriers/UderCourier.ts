import AbstractCourier from "./AbstractCourier";
import { TariffResult } from "../TariffResult";

interface ManifestItem {
  name: string;
  quantity: number;
  price: number;
  dimensions: {
    length: number;
    height: number;
    depth: number;
  };
}

interface UderPayload {
    pickup_address: string;
    pickup_name: string;
    pickup_phone_number: string;
    dropoff_address: string;
    dropoff_name: string;
    dropoff_phone_number: string;
    manifest_items: ManifestItem[];
}

interface UderResponse {
  dropoff_eta: string;
  tracking_url: string;
  id: string;
  fee: number;
  dropoff: {
    location: {
      lat: number;
      lng: number;
    };
    verification_requirements: {
      signature: boolean;
      picture: boolean;
      pincode: {
        value: string;
        enabled: boolean;
      };
      signature_requirement: {
        enabled: boolean;
        collect_signer_name: boolean;
        collect_signer_relationship: boolean;
      };
    };
  };
  error?: string;
}


class UderCourier extends AbstractCourier<UderPayload, UderResponse> {
    name = "Uder";
    apiKey = process.env.NEXT_PUBLIC_UDER_API_KEY || "";
    apiUrl = process.env.NEXT_PUBLIC_UDER_API_URL || "";

    async calculateTariff(): Promise<TariffResult> {
        const requestBody = this.buildRequestBody();
        console.log("Uder request body:", JSON.stringify(requestBody));
        try {
            const response = await this.fetchTariff(requestBody);
            if (response.error) {
                return {
                    available: false,
                    courierName: this.name,
                    price: 0
                };
            }

            const pricingTotal = response.fee;
            console.log("Uder pricing total (USD):", pricingTotal);
            return {
                available: true,
                courierName: this.name,
                price: pricingTotal
            };

        } catch (error) {
            console.error("Error fetching tariff from Uder:", error);
            throw error;
        }
    }

    protected buildRequestBody(): UderPayload {
        const products = this.shippingData.products;
        const customerData = this.shippingData.customerData;

        const manifest_items: ManifestItem[] = products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            dimensions: {
                length: product.width,
                height: product.height,
                depth: product.depth
            }
        }));

        return {
            pickup_address: process.env.NEXT_PUBLIC_PICK_UP_STREET || "",
            pickup_name: process.env.NEXT_PUBLIC_PICK_UP_NAME || "",
            pickup_phone_number: process.env.NEXT_PUBLIC_PICK_UP_PHONE || "",
            dropoff_address: customerData.shippingStreet,
            dropoff_name: customerData.name,
            dropoff_phone_number: customerData.phone,
            manifest_items
        };
    }
}

export default UderCourier;