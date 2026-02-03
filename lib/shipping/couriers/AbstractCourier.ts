import { ShippingDTO } from "@/lib/types/shipping/CourierTypes";
import Courier from "../Courier";
import { TariffResult } from "../TariffResult";

abstract class AbstractCourier<TPayload, TResponse> implements Courier {

    protected readonly shippingData: ShippingDTO;
    abstract readonly name: string;
    protected abstract apiUrl: string;
    protected abstract apiKey: string;

    constructor(shippingData: ShippingDTO) {
        this.shippingData = shippingData;
    }
    
    abstract calculateTariff(): Promise<TariffResult>;     

    protected abstract buildRequestBody(): TPayload;
    
    protected async fetchTariff(body: TPayload): Promise<TResponse> {
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": this.apiKey
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }

        const data = await response.json() as TResponse;
        console.log(`Response from ${this.name}:`, data);
        return data;
    }

}

export default AbstractCourier;
