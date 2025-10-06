# AutoParts E-commerce - Astro + Stripe

Un e-commerce completo y listo para producción construido con Astro, React, Tailwind CSS y Stripe.

## 🚀 Características

- **Frontend moderno**: Astro con islands de React para interactividad
- **Pagos seguros**: Integración completa con Stripe Checkout
- **Diseño responsivo**: Tailwind CSS con componentes optimizados
- **Gestión de estado**: Carrito persistente en localStorage
- **SEO optimizado**: Meta tags, Open Graph, datos estructurados
- **Rendimiento**: Imágenes lazy loading, prefetch de rutas críticas
- **Accesibilidad**: HTML semántico, navegación por teclado

## 📦 Stack Tecnológico

- **Framework**: Astro 5.x con TypeScript
- **UI**: React islands + Tailwind CSS
- **Pagos**: Stripe Checkout
- **Validación**: Zod
- **Datos**: JSON local (fácil migración a CMS)

## 🛠️ Instalación

1. **Clonar e instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita `.env` con tus claves de Stripe:
```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica_aqui
TAX_RATE=0.13
FREE_SHIPPING_THRESHOLD=60
SHIPPING_FLAT=6
```

3. **Ejecutar en desarrollo**:
```bash
npm run dev
```

## 🔧 Configuración de Stripe

1. **Crear cuenta en Stripe**:
   - Ve a [dashboard.stripe.com](https://dashboard.stripe.com/register)
   - Completa el registro

2. **Obtener claves API**:
   - En el dashboard, ve a "Developers" > "API keys"
   - Copia la "Secret key" (sk_test_...) y "Publishable key" (pk_test_...)

3. **Configurar webhooks** (opcional para producción):
   - Ve a "Developers" > "Webhooks"
   - Añade endpoint: `https://tu-dominio.com/api/webhook`
   - Selecciona eventos: `checkout.session.completed`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React y Astro
│   ├── CartBadge.tsx   # Badge del carrito (island)
│   ├── CartPage.tsx    # Página del carrito (island)
│   ├── ProductCard.tsx # Tarjeta de producto (island)
│   ├── Header.astro    # Header con navegación
│   └── Footer.astro    # Footer del sitio
├── content/
│   └── products.json   # Datos de productos
├── layouts/
│   └── Layout.astro    # Layout base con SEO
├── lib/                # Utilidades y lógica de negocio
│   ├── cart.ts         # Gestión del carrito
│   ├── products.ts     # Funciones de productos
│   ├── currency.ts     # Formateo de moneda
│   ├── stripe.ts       # Cliente de Stripe
│   └── types.ts        # Tipos TypeScript
├── pages/              # Rutas del sitio
│   ├── index.astro     # Página principal
│   ├── cart.astro      # Carrito de compras
│   ├── success.astro   # Pago exitoso
│   ├── cancel.astro    # Pago cancelado
│   ├── products/
│   │   ├── index.astro # Catálogo de productos
│   │   └── [slug].astro # Detalle de producto
│   └── api/
│       └── checkout.ts # Endpoint de Stripe
└── styles/
    └── global.css      # Estilos globales
```

## 🛒 Funcionalidades

### Catálogo de Productos
- Grid responsivo de productos
- Búsqueda en tiempo real
- Filtros por categoría
- Ordenamiento por precio/nombre
- Paginación automática

### Carrito de Compras
- Persistencia en localStorage
- Actualización de cantidades
- Cálculo automático de totales
- Validación de stock
- Badge con contador en header

### Proceso de Pago
- Integración con Stripe Checkout
- Validación de precios en servidor
- Verificación de stock
- Cálculo de impuestos y envío
- Páginas de éxito/cancelación

### Cálculo de Precios
- **Subtotal**: Suma de (cantidad × precio)
- **Impuesto**: 13% configurable
- **Envío**: $6 fijo, gratis si subtotal ≥ $60
- **Total**: Subtotal + Impuesto + Envío

## 🚀 Despliegue

### Netlify
1. Conecta tu repositorio en [netlify.com](https://netlify.com)
2. Configura las variables de entorno en Site Settings
3. Deploy automático en cada push

### Vercel
1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Configura las variables de entorno
3. Deploy automático en cada push

### Variables de Entorno para Producción
```env
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_de_produccion
STRIPE_PUBLIC_KEY=pk_live_tu_clave_publica_de_produccion
TAX_RATE=0.13
FREE_SHIPPING_THRESHOLD=60
SHIPPING_FLAT=6
```

## 🔒 Seguridad

- Validación de datos con Zod
- Verificación de precios en servidor
- Claves de Stripe en variables de entorno
- Sanitización de inputs
- HTTPS obligatorio en producción

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid adaptativo
- Navegación móvil
- Touch-friendly interfaces

## 🎨 Personalización

### Colores
Edita `tailwind.config.mjs` para cambiar la paleta:
```js
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

### Productos
Edita `src/content/products.json` para añadir/modificar productos:
```json
{
  "id": "nuevo-producto",
  "slug": "nuevo-producto",
  "name": "Nombre del Producto",
  "brand": "Marca",
  "images": ["url-imagen"],
  "price": 29.99,
  "sku": "SKU-001",
  "stock": 10,
  "tags": ["categoria"],
  "description": "Descripción del producto",
  "specs": {
    "Especificación": "Valor"
  }
}
```

## 🐛 Solución de Problemas

### Error: "Stripe is not configured"
- Verifica que `STRIPE_SECRET_KEY` esté configurada
- Asegúrate de usar claves reales, no las de ejemplo

### Carrito no se actualiza
- Verifica que JavaScript esté habilitado
- Revisa la consola del navegador por errores
- Limpia localStorage: `localStorage.clear()`

### Imágenes no cargan
- Verifica que las URLs sean válidas
- Usa HTTPS para imágenes externas
- Considera usar un CDN de imágenes

## 📄 Licencia

MIT License - puedes usar este código para proyectos comerciales y personales.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si necesitas ayuda:
- Revisa la documentación de [Astro](https://docs.astro.build)
- Consulta la documentación de [Stripe](https://stripe.com/docs)
- Abre un issue en el repositorio