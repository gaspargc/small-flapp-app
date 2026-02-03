import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPinPlus, MapPinPen } from 'lucide-react';
import { useState } from "react"
import { ShippingCustomerData } from "@/lib/types/shipping/CourierTypes";
import useUserData from "@/hooks/useUserData"


const addressSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  shippingStreet: z.string().min(1, "La calle es requerida"),
  commune: z.string().min(1, "La comuna es requerida"),
  phone: z.string()
    .min(1, "El teléfono es requerido")
    .regex(/^\+?56\s?9\s?\d{4}\s?\d{4}$/, "Formato de teléfono inválido")
})

interface AddressDialogProps {
  isOpen: boolean;
  isAddressDataValid: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSubmit: (address: ShippingCustomerData) => void;
}


export function AddressDialog({ isOpen, isAddressDataValid, onOpen, onClose, onSubmit }: AddressDialogProps) {
  const { shippingAddress } = useUserData();
  const [formData, setFormData] = useState<ShippingCustomerData>(() => 
    shippingAddress ?? {
      name: "",
      shippingStreet: "",
      commune: "",
      phone: ""
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleChange(field: keyof ShippingCustomerData, value: string) {
    setFormData({
      ...formData,
      [field]: value
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ""
      })
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const result = addressSchema.safeParse(formData)
    
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as string;
        if (fieldName) {
          newErrors[fieldName] = err.message
        }
      })
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
    onClose()
    setErrors({})
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? onOpen() : onClose()}>
        {!isAddressDataValid ? (
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <MapPinPlus className="mr-2 h-4 w-4" /> Agregar dirección
            </Button>
          </DialogTrigger>
        ) : (
          <div className="flex justify-between items-center p-4 border rounded-md">
            <div className="text-sm">
              <p className="text-muted-foreground">Enviar a {shippingAddress?.name}</p>
              <p className="font-semibold">{shippingAddress?.shippingStreet}, {shippingAddress?.commune}</p>
              <p className="text-muted-foreground">{shippingAddress?.phone}</p>
            </div>
            <DialogTrigger asChild>
              <Button className="flex" variant="outline">
                <MapPinPen className="" />
              </Button>
            </DialogTrigger>
          </div>
        )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Completa tu dirección</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name" 
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g Pedro Duarte"
              />
              {errors.name && (
                <FieldError>{errors.name}</FieldError>
              )}
            </Field>

            <Field>
              <Label htmlFor="shippingStreet">Calle</Label>
              <Input
                id="shippingStreet"
                name="shippingStreet"
                value={formData.shippingStreet}
                onChange={(e) => handleChange("shippingStreet", e.target.value)}
                placeholder="e.g Av. Siempre Viva 123" 
              />
              {errors.shippingStreet && (
                <FieldError>{errors.shippingStreet}</FieldError>
              )}
            </Field>

            <Field>
              <Label htmlFor="commune">Comuna</Label>
              <Input
                id="commune"
                name="commune"
                value={formData.commune}
                onChange={(e) => handleChange("commune", e.target.value)}
                placeholder="e.g Vitacura"
                />
              {errors.commune && (
                <FieldError>{errors.commune}</FieldError>
              )}
            </Field>

            <Field>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="e.g +56 9 1234 5678"
              />
              {errors.phone && (
                <FieldError>{errors.phone}</FieldError>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
