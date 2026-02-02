import { TariffResult } from "./TariffResult";

export default interface Courier {
    readonly name: string;
    calculateTariff(): Promise<TariffResult>;
}