"use client";

import { useRef } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dices } from "lucide-react"
import { Spinner } from './ui/spinner';
import { useState } from 'react';
import useCart from "@/hooks/useCart";

const API_URL = process.env.NEXT_PUBLIC_DUMMY_API_URL;

export default function GenerateCartButton() {
  const { setCart } = useCart();
  const totalCartsRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateCart = async () => {
    try {
      if (totalCartsRef.current === null) {
        totalCartsRef.current = await getTotalCarts();
      }

      const total = totalCartsRef.current;
      if (!total || total <= 0) {
        throw new Error("No carts available");
      }

      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={generateCart} disabled={isLoading}>
      {isLoading ? <Spinner className="h-4 w-4" /> : <Dices />} Generar carrito
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