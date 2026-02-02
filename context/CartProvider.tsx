"use client"

import { useState } from "react"
import { CartContext } from "./CartContext"
import { Cart } from "@/lib/types/ui/cartTypes"

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)

  const clearCart = () => setCart(null)

  return (
    <CartContext.Provider value={{ cart, setCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
};
