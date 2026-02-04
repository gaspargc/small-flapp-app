"use client"

import { createContext } from "react"
import { Cart } from "@/lib/types/ui/CartTypes"
import { ShippingCustomerData } from "@/lib/types/shipping/CourierTypes";
import { ApiCartResponse } from "@/lib/cart/types";

export interface UserContextValue {
  cart: Cart | null
  setCart: (cart: Cart) => void
  clearCart: () => void

  shippingAddress: ShippingCustomerData | null
  setShippingAddress: (address: ShippingCustomerData) => void

  tariffResult: ApiCartResponse | null
  setTariffResult: (tariff: ApiCartResponse) => void
  clearTariffResult: () => void
}

export const UserContext = createContext<UserContextValue | null>(null)