import Courier from "./Courier";
import { ShippingDTO } from "@/lib/types/shipping/CourierTypes";
import TraeloYaCourier from "./couriers/TraeloYaCourier";
import UderCourier from "./couriers/UderCourier";

class CourierFactory {
  static createAllCouriers(shippingData: ShippingDTO): Courier[] {
    return [
      new TraeloYaCourier(shippingData),
      new UderCourier(shippingData)
    ];
  }
}

export default CourierFactory;