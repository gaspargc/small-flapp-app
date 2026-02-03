# 📦 Flapp E-commerce

Aplicación frontend-backend que simula el comportamiento de una compra a través de un e-commerce llamado "Flapp".

> 🚀 Demo: https://small-flapp-app.vercel.app

## Tecnologías

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **UI Components:** Radix UI, Lucide Icons
- **Validación:** Zod

## Requisitos Previos

- Node.js 18 o superior
- npm, yarn, pnpm o bun

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd small-flapp-app
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo de variables de entorno `.env`:
```bash
# API de productos (DummyJSON)
NEXT_PUBLIC_DUMMY_API_URL=https://dummyjson.com

# Configuración de pickup (origen del despacho)
NEXT_PUBLIC_PICK_UP_STREET="Av. Providencia 1234"
NEXT_PUBLIC_PICK_UP_COMMUNE="Providencia"
NEXT_PUBLIC_PICK_UP_PHONE="+56912345678"
NEXT_PUBLIC_PICK_UP_NAME="Mi Tienda"

# Los siguientes son datos de ejemplo

# TraeloYa API
TRAELO_YA_API_KEY=tu_api_key
TRAELO_YA_API_URL=https://api.traeloya.com/v1/estimate
# Uder API
UDER_API_KEY=tu_api_key
UDER_API_URL=https://api.uder.com/v1/deliveries/quote
```

## Ejecución

### Desarrollo
```bash
npm run dev
```
Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Producción
```bash
npm run build
npm start
```

## 🐳 Ejecución opcional con Docker

### Requisitos
- Docker instalado en tu sistema

### Construir y ejecutar

1. Construir la imagen:
```bash
docker build -t flapp-app .
```

2. Ejecutar el contenedor:
```bash
docker run -p 3000:3000 --env-file .env flapp-app
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

# Resumen de la estructura del proyecto

```
├── app/                    # App Router de Next.js
│   ├── api/cart/          # API Route para cotización de despacho
│   ├── checkout/          # Página de checkout
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de UI (Button, Card, etc.)
├── context/              # Context API (UserProvider)
├── hooks/                # Custom hooks
└── lib/
    ├── shipping/         # Lógica de tarificación
    │   ├── couriers/    # Implementación de couriers (TraeloYa, Uder)
    │   ├── TariffCalculator.ts
    │   └── CourierFactory.ts
    └── types/           # Tipos TypeScript

```

## Funcionalidades

1. **Generar Carrito:** Genera un carrito aleatorio con productos de DummyJSON API
2. **Agregar Dirección:** Formulario validado para ingresar dirección de envío
3. **Cotizar Despacho:** Calcula la tarifa más económica entre los couriers disponibles
4. **Verificación de Stock:** Valida disponibilidad de productos antes de cotizar

## API Endpoints

### POST /api/cart
Cotiza el despacho para un carrito de compras.

**Request Body:**
```json
{
  "products": [
    {
      "productId": 1,
      "price": 100,
      "quantity": 2,
      "discount": 10
    }
  ],
  "customer_data": {
    "name": "Juan Pérez",
    "shipping_street": "Av. Siempre Viva 123",
    "commune": "Providencia",
    "phone": "+56912345678"
  }
}
```

**Response (200):**
```json
{
  "courier": "TraeloYa",
  "price": 5990
}
```
**Response (400):**
```json
{
  "error": "No hay tarifas disponibles para el envío solicitado."
}
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |
