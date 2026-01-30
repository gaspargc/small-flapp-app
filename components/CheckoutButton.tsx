"use client";

import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import useCart from "@/hooks/useCart";
import { ArrowRightToLine } from "lucide-react"

export default function CheckoutButton() {
  const router = useRouter();
  const { cart } = useCart();

  useEffect(() => {
    router.prefetch('/checkout');
  }, [router]);
  
  const handleCheckout = () => {
    if (!cart) {
      toast.warning("Debes generar un carrito antes de finalizar la compra.");
      return;
    }
    console.log("Checkout cart:", cart);
    router.push('/checkout');
  };

  return (
    <div onClick={handleCheckout}>
      <Button size="lg" variant="secondary" disabled={!cart}>
        <ArrowRightToLine /> Finalizar compra
      </Button>
    </div>
  );
};
