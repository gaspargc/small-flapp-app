"use client"

import { createContext } from "react"
import { Cart } from "@/lib/types/ui/cartTypes"

export interface CartContextValue {
  cart: Cart | null
  setCart: (cart: Cart) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)