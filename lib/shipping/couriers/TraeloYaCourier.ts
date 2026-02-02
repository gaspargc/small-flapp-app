import AbstractCourier from "./AbstractCourier";
import { TariffResult } from "../TariffResult";

interface TraeloYaPayload {
    items: {
        quantity: number;
        value: number;
        volume: number;
    }[],
    waypoints: [{
        type: "PICK_UP";
        addressStreet: string;
        city: string;
        phone: string;
        name: string;
    },
    {
        type: "DROP_OFF";
        addressStreet: string;
        city: string;
        phone: string;
        name: string;
    }]
}

interface TraeloYaResponse {
    estimateId: string;
    deliveryOffers: {
        deliveryOfferId: string;
        confirmationTimeLimit: Date;
        deliveryMode: string;
        pricing: {
            total: number;
        }
    },
    route: {
        distance: number;
    },
    waypoints: [
        {
            type: "PICK_UP",
            latitude: number;
            longitude: number;
        },
        {
            type: "DROP_OFF",
            latitude: number;
            longitude: number;
        }
    ],
    error?: string;
}


class TraeloYaCourier extends AbstractCourier<TraeloYaPayload, TraeloYaResponse> {
    name = "TraeloYa";
    apiKey = process.env.NEXT_PUBLIC_TRAELO_YA_API_KEY || "";
    apiUrl = process.env.NEXT_PUBLIC_TRAELO_YA_API_URL || "";

    async calculateTariff(): Promise<TariffResult> {
        const requestBody = this.buildRequestBody();

        try {
            const response = await this.fetchTariff(requestBody);
            console.log("TraeloYa response:", response);
            if (response.error) {
                return {
                    available: false,
                    courierName: this.name,
                    price: 0
                };
            }

            const pricingTotal = response.deliveryOffers.pricing.total;
            return {
                available: true,
                courierName: this.name,
                price: pricingTotal
            };

        } catch (error) {
            console.error("Error fetching tariff from TraeloYa:", error);
            throw error;
        }
    }

    protected buildRequestBody(): TraeloYaPayload {
        const products = this.shippingData.products;
        const customerData = this.shippingData.customerData;

        const items = products.map(product => ({
            quantity: product.quantity,
            value: product.price * product.quantity,
            volume: product.width * product.height * product.depth
        }));
        
        const waypoints: TraeloYaPayload["waypoints"] = [
            {
                type: "PICK_UP",
                addressStreet: "Juan de Valiente 3630",
                city: "Santiago",
                phone: "+56912345678",
                name: "Tienda Flapp"
            },
            {
                type: "DROP_OFF",
                addressStreet: customerData.shippingStreet,
                city: customerData.commune,
                phone: customerData.phone,
                name: customerData.name
            }
        ];

        return { items, waypoints };
    }
}

export default TraeloYaCourier;