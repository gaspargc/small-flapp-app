import { TariffResult } from "../TariffResult";

export interface Courier {
    readonly name: string;
    calculateTariff(): Promise<TariffResult>;
}