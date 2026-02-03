"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useUserData from "@/hooks/useUserData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { CornerDownLeft, Trash, Truck, ShoppingCart } from 'lucide-react';
import { useEffect, useState, useRef } from "react";
import { ShippingCustomerData } from "@/lib/types/shipping/CourierTypes";
import { AddressDialog } from "./_components/AddressDialog";


export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    shippingAddress,
    setShippingAddress,
    tariffResult,
    setTariffResult
  } = useUserData();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isWaitingForTariff, setIsWaitingForTariff] = useState(false);
  const [isAddressDataValid, setIsAddressDataValid] = useState<boolean>(!!shippingAddress);
  const abortControllerRef = useRef<AbortController | null>(null);


  useEffect(() => {
    if (!cart) {
      router.replace('/');
    }
  }, [cart, router]);

  function handleClearCart() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearCart();
    router.replace('/');
  }

  async function handleCartShipping() {
    try {
      if (!cart) return;
      if (!isAddressDataValid) {
        toast.error("Debes agregar una dirección válida para cotizar el despacho.");
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsWaitingForTariff(true);
      
      const productsPayload = cart.products.map(p => ({
        productId: p.id,
        price: p.price,
        quantity: p.quantity,
        discount: p.discountPercentage
      }));

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          products: productsPayload,
          customer_data: {
            name: shippingAddress?.name,
            shipping_street: shippingAddress?.shippingStreet,
            commune: shippingAddress?.commune,
            phone: shippingAddress?.phone
          }
        }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        const errorText = await res.text();
        setTariffResult({ error: errorText, courier: "", price: 0 });
        return;
      }

      const data = await res.json();
      setTariffResult({ error: undefined, courier: data.courier, price: data.price });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error(err);
      setTariffResult({ error: "Error inesperado", courier: "", price: 0 });
    } finally {
      setIsWaitingForTariff(false);
    }
  }

  function handleAddressSubmit(address: ShippingCustomerData) {
    setShippingAddress(address);
    setIsAddressDialogOpen(false);
    setIsAddressDataValid(true);
  }

  if (!cart) {
    return null;
  }
  const listProducts = cart.products.map((product) => (
    <Card key={product.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image 
              src={product.thumbnail} 
              alt={product.title} 
              fill
              className="object-cover"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                <span>Cantidad: <strong>{product.quantity}</strong></span>
                <Separator orientation="vertical" className="h-4" />
                <span>Precio: <strong>${product.price}</strong></span>
              </div>
            </div>

            {/* Prices and Discount */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.discountPercentage > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    -{product.discountPercentage}%
                  </Badge>
                )}
              </div>
              <div className="text-right">
                {product.discountPercentage > 0 && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${product.total}
                  </p>
                )}
                <p className="text-lg font-bold">
                  ${product.discountedTotal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ));


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          Checkout
        </h1>
        <p className="text-muted-foreground mt-1">
          Revisa tu pedido antes de continuar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Productos ({cart.totalProducts})</CardTitle>
              <CardDescription>
                {cart.totalQuantity} {cart.totalQuantity === 1 ? 'artículo' : 'artículos'} en total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {listProducts}
            </CardContent>
          </Card>
        </div>

        {/* Purchase Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen de Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Purchase Details */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total de productos:</span>
                  <span className="font-medium">{cart.totalProducts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cantidad total:</span>
                  <span className="font-medium">{cart.totalQuantity}</span>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${cart.total}</span>
                </div>
                
                {cart.total !== cart.discountedTotal && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento:</span>
                    <span className="font-medium">
                      -${(cart.total - cart.discountedTotal).toFixed(2)}
                    </span>
                  </div>
                )}
                
                <Separator className="my-3" />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío:</span>
                  {isWaitingForTariff ? (
                    <Spinner className="h-4 w-4" />
                  ) : tariffResult === null ? (
                    <span className="text-muted-foreground">-</span>
                  ) : tariffResult.error ? (
                    <span className="font-medium text-red-600">No hay envíos disponibles :(</span>
                  ) : (
                    <span className="font-medium text-primary text-right">
                      Envío Flapp con {tariffResult.courier} ⚡️ - ${tariffResult.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <Separator className="my-3" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${(cart.discountedTotal + (tariffResult ? tariffResult.price : 0)).toFixed(2)} USD</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <AddressDialog 
                  isOpen={isAddressDialogOpen}
                  isAddressDataValid={isAddressDataValid}
                  onOpen={() => setIsAddressDialogOpen(true)}
                  onClose={() => setIsAddressDialogOpen(false)}
                  onSubmit={handleAddressSubmit}
                />
                <div onClick={handleCartShipping}>
                  <Button className="w-full" size="lg" disabled={!isAddressDataValid}>
                    {isWaitingForTariff ? (
                      <Spinner className="mr-2 h-4 w-4" />
                    ) : (
                      <Truck className="mr-2 h-4 w-4" />
                    )}
                    Cotizar despacho
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={handleClearCart}
                    className="flex-1"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Limpiar
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/">
                      <CornerDownLeft className="mr-2 h-4 w-4" />
                      Volver
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}