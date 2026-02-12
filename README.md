# 📦 Flapp E-commerce

Aplicación frontend-backend que simula el comportamiento de una compra a través de un e-commerce llamado "Flapp".

> 🚀 Demo: https://small-flapp-app.vercel.app

## Tecnologías

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **UI Components:** Radix UI, Lucide Icons
- **Validación:** Zod
- **Testing**: Jest

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
NEXT_PUBLIC_PICK_UP_STREET="Juan de Valiente 3630"
NEXT_PUBLIC_PICK_UP_COMMUNE="Vitacura"
NEXT_PUBLIC_PICK_UP_PHONE="+56912345678"
NEXT_PUBLIC_PICK_UP_NAME="Tienda Flapp"

# TraeloYa API
TRAELO_YA_API_KEY=tu_api_key
TRAELO_YA_API_URL=tu_api_url

# Uder API
UDER_API_KEY=tu_api_key
UDER_API_URL=tu_api_url
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

## Tests

El proyecto incluye pruebas unitarias usando **Jest** para validar la lógica crítica de la aplicación.

### Ejecutar Tests

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm test -- --watch

# Ejecutar pruebas con cobertura
npm test -- --coverage
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta las pruebas unitarias con Jest |

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

# Sobre la elaboración de la app

## Uso de IA
En general, se utilizó IA para guíarse sobre como construir la solución general de la aplicación, mejorar la eficiencia en la programación, autocompletado (Github Copilot) y la corrección de errores menores. En ningún caso NO se validaron las respuestas generadas por los modelos de IA.

Usos particulares:
- Styling de landing page
- ChatGPT para guiar la construcción del state del carrito (context + hook)
- [Styling de checkout](https://chatgpt.com/share/697d3aa9-c930-8000-a3c8-da508d40d19a)
- [Imprimir tabla en consola](https://chatgpt.com/share/697e3b8f-de68-8000-8f2e-2d94b0431282)
- [Guía sobre CourierFactory](https://chatgpt.com/share/697eaed2-91f0-8000-ab7b-051eacd0825f)
- ChatGPT para guiar la solución de tipos genéricos en la clase abstracta de Courier
- [Claude para mejorar el diseño inicial de la página de checkout](https://claude.ai/share/552e6a3e-2449-41e7-93d2-a590116456e7) (luego fue modificado)
- [Claude para validar la data del form address con Zod](https://claude.ai/share/c8bc63b1-5850-4c88-81f6-c32b56c5258c)
- Copilot para generar rápidamente el auto-focus al rellenar el form de address

## Asunciones

- Habrá al menos un carrito disponible.
- Los productos del carrito existirán siempre; de otro modo el endpoint retornará un fallo.
- No se necesitarán más de dos waypoints en la respuesta y body de TraeloYa.
- Todos los couriers son endpoints POST donde el header debe llevar la API key.
- TraeloYa solo devuelve un único `deliveryOffer`.
- Solo existe una única tienda Flapp como PICK_UP; no es necesario seleccionar entre varias opciones. Se considera que esta información no es sensible.
- TraeloYa trabaja con CLP y m³ de input, y output en CLP.
- Se considera ciudad = comuna.
- El precio informado al courier será sin descuento para todos los casos.
- Uder trabaja en USD.
- De antemano no se sabe la divisa del próximo courier a agregar.
