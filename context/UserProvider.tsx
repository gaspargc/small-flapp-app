"use client"

import { useState } from "react"
import { UserContext } from "./UserContext"
import { Cart } from "@/lib/types/ui/CartTypes"
import { ShippingCustomerData } from "@/lib/types/shipping/CourierTypes";
import { ApiCartResponse } from "@/lib/cart/types";

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const clearCart = () => {
    setCart(null);
    setTariffResult(null);
  };

  const [shippingAddress, _setShippingAddress] = useState<ShippingCustomerData | null>(null)
  const setShippingAddress = (address: ShippingCustomerData) => {
    _setShippingAddress(address);
    setTariffResult(null);
  }

  const [tariffResult, setTariffResult] = useState<ApiCartResponse | null>(null)
  const clearTariffResult = () => setTariffResult(null)

  return (
    <UserContext.Provider value={
      { cart,
        setCart,
        clearCart,
        shippingAddress,
        setShippingAddress,
        tariffResult,
        setTariffResult,
        clearTariffResult
      }
    }>
      {children}
    </UserContext.Provider>
  )
};
