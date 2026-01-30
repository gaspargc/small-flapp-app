"use client";

import { useRef } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dices } from "lucide-react"
import useCart from "@/hooks/useCart";

const API_URL = process.env.NEXT_PUBLIC_DUMMY_API_URL;

export default function GenerateCartButton() {
  const { setCart } = useCart();
  const totalCartsRef = useRef<number | null>(null);


  const generateCart = async () => {
    try {
      if (totalCartsRef.current === null) {
        totalCartsRef.current = await getTotalCarts();
      }

      const total = totalCartsRef.current;
      if (!total || total <= 0) {
        throw new Error("No carts available");
      }

      const randomSkip = Math.floor(Math.random() * total);
      const response = await fetch(
        `${API_URL}/carts?limit=1&skip=${randomSkip}`
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      const cart = data.carts[0];
      setCart(cart);
      console.log("Generated cart:", cart);

    } catch (error) {
      console.error(error);
      toast.error("Error al generar el carrito, por favor intenta nuevamente.");
    }
  };

  return (
    <Button size="lg" onClick={generateCart}>
      <Dices /> Generar carrito
    </Button>
  );
};

async function getTotalCarts() {
  try {
    const response = await fetch(`${API_URL}/carts`);

    if (!response.ok) {
      throw new Error("Failed to fetch total carts");
    }

    const data = await response.json();
    return data.total;

  } catch (error) {
    console.error("Error fetching total carts:", error);
    return 0;
  }
}