import CourierFactory from "./CourierFactory";
import { ShippingDTO } from "@/lib/types/shipping/courierTypes";
import { TariffResult } from "./TariffResult";


class TariffCalculator {

  static async getLowestTariff(shippingData: ShippingDTO): Promise<TariffResult> {
    const couriers = CourierFactory.createAllCouriers(shippingData);
    
    let lowestTariff: TariffResult = {
      available: false,
      courierName: "",
      price: Infinity
    };

    for (const courier of couriers) {
      const tariff: TariffResult = await courier.calculateTariff();
      if (tariff.price < lowestTariff.price && tariff.available) {
        lowestTariff = tariff;
      }
    }

    return lowestTariff;
  }
}

export default TariffCalculator;
