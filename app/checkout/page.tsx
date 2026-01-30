"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CornerDownLeft, Trash, Truck } from 'lucide-react';
import useCart from "@/hooks/useCart";
import { useEffect } from "react";


export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  useEffect(() => {
    if (!cart) {
      router.replace('/');
    }
  }, [cart, router]);

  if (!cart) {
    return null;
  }

  const listProducts = cart.products.map((product) => (
    <li key={product.id}>
      <div className="flex flex-row">
        <div>
          <Image src={product.thumbnail} alt={product.title} width={200} height={200} />
          <h3>{product.title}</h3>
        </div>

        <div>
          <p>Cantidad: {product.quantity}</p>
        </div>
        <p>Precio unitario: ${product.price}</p>
        <p>Total: ${product.total}</p>
        <p>Descuento: {product.discountPercentage}%</p>
        <p>Total con descuento: ${product.discountedTotal}</p>
      </div>
    </li>
  ));

  function handleClearCart() {
    clearCart();
    router.replace('/');
  }

  return (
    <div className="flex flex-row">
      <div className="basis-2/3">
        <ul>{listProducts}</ul>
      </div>
      <div className="basis-1/3">
        <h2>Resumen de Compra</h2>
        <p>Total de productos: {cart.totalProducts}</p>
        <p>Cantidad total: {cart.totalQuantity}</p>
        <p>Total: ${cart.total}</p>
        <p>Total con descuento: ${cart.discountedTotal}</p>

        <Button className="mb-4 mt-4"><Truck /> Cotizar despacho</Button>
        <div className="flex flex-row gap-4">
          <Button variant="destructive" onClick={handleClearCart}><Trash /> Limpiar carrito</Button>
          <Button variant="secondary" asChild>
            <Link href="/">
              <CornerDownLeft /> Volver
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
