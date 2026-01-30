import { ShoppingCart } from "lucide-react"
import GenerateCartButton from "@/components/GenerateCartButton";
import CheckoutButton from "@/components/CheckoutButton";

export default function Home() {
  return (
    <section className="flex h-screen">
      <div className="m-auto">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="mx-auto mb-6 h-24 w-24 text-muted-foreground" />

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Bienvenido a Flapp e-commerce
          </h1>

          <p className="mt-4 text-muted-foreground sm:text-lg">
            Genera tu carrito y calcula el despacho con facilidad.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <GenerateCartButton />
            <CheckoutButton />
          </div>
        </div>
      </div>
    </section>
  );
}
