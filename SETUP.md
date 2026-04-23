# JOIS Leather — Setup & Launch Guide

## 🚀 Estado Actual

✅ **Website completo y funcional**
✅ **Content Editor con carga de fotos/videos**
✅ **Sistema de usuarios (registro/login)**
✅ **Dashboard de cliente**
✅ **Módulo de envío configurado**
✅ **SEO básico**
⏳ **Esperando:** Stripe API Keys, fotos reales de productos

---

## 📋 Checklist de Lanzamiento

### 1. Fotos de Productos (PRIORIDAD ALTA)
El website usa imágenes placeholder. Para fotos reales:

**Guía de fotos requerida:**
```
📷 Especificaciones para fotos de producto:

CAMARA:
- Smartphone con cámara mínima 12MP o DSLR
- Luz natural o estudio con softbox

FONDO:
- Fondo blanco (#FFFFFF) o gris claro (#F5F5F5)
- Superficie limpia y sin distractions

ANGULOS REQUERIDOS:
1. Front (90°) - Vista frontal completa
2. Angle (45°) - Vista diagonal 
3. Detail - Close-up del material/acabado
4. Interior - Si tiene compartimentos internos

TAMAÑO:
- Mínimo 1200x1600px (recomendado 2000x2666px)
- Formato: JPG, WebP
- Calidad: 80-90%

NOMENCLATURA:
- producto-color-angulo.jpg
Ejemplo: bomber-noir-front.jpg

ENVIAR A:
- Subir al Content Editor (content-editor-v3.html)
- O enviar por email a info@joisleather.io
```

### 2. Stripe (Pagos con Tarjeta)

**Paso 1: Obtener API Keys**
1. Ir a https://dashboard.stripe.com/register
2. Crear cuenta (o usar existente)
3. Ir a Developers → API Keys
4. Copiar:
   - Publishable key (pk_live_...)
   - Secret key (sk_live_...)

**Paso 2: Configurar Webhooks** (para producción)
1. Ir a Stripe Dashboard → Webhooks
2. Agregar endpoint: `https://tudominio.com/api/stripe-webhook`
3. Eventos necesarios:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

**Paso 3: Reemplazar en el código**
```javascript
// En app.js, línea ~150
const STRIPE_PUBLIC_KEY = 'pk_live_TU_KEY_AQUI';
const STRIPE_SECRET_KEY = 'sk_live_TU_KEY_AQUI';
```

### 3. NOWPayments (Crypto)

**Paso 1: Registro**
1. Ir a https://nowpayments.io/register
2. Completar KYC si necesario
3. Ir a Dashboard → API Keys
4. Copiar:
   - API Key (para withdrawals)
   - IPN Secret

**Paso 2: Configurar**
```javascript
// En app.js
const NOWPAYMENTS_API_KEY = 'TU_NOWPAYMENTS_API_KEY';
const NOWPAYMENTS_IPN_SECRET = 'TU_IPN_SECRET';
```

**Cryptos aceptados:**
- BTC, ETH, USDT (ERC20), USDC, LTC, XRP

### 4. Dominio Personalizado

**Opción A: GitHub Pages (Gratis)**
1. Comprar dominio en Namecheap/GoDaddy
2. Configurar DNS:
   ```
   Tipo A: @ → 185.199.108.153
   Tipo A: @ → 185.199.109.153
   Tipo A: @ → 185.199.110.153
   Tipo A: @ → 185.199.111.153
   CNAME: www → cryptovh0.github.io
   ```
3. Settings → Pages → Custom Domain: joisleather.io

**Opción B: VPS (Más control)**
1. Comprar VPS (DigitalOcean, Vultr)
2. Instalar Nginx
3. Clone repo: `git clone https://github.com/CryptoVH0/jois-leather`
4. Configurar Nginx:
```nginx
server {
    listen 80;
    server_name joisleather.io;
    root /var/www/jois-leather;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 5. Email Profesional (Opcional)

**Recomendado: Resend (Gratis hasta 100 emails/día)**
1. Ir a https://resend.com
2. Configurar dominio propio
3. Integrar para:
   - Confirmación de registro
   - Recuperación de contraseña
   - Confirmación de pedido

---

## 📁 Estructura del Proyecto

```
jois-leather/
├── index.html              # Homepage principal
├── nft.html                # Página NFT
├── favicon.svg             # Favicon
├── styles.css              # Estilos principales
├── app.js                  # JS principal (carrito, etc.)
│
├── account/
│   └── login.html         # Login/Registro
│
├── dashboard/
│   └── account.html       # Panel de cliente
│
├── content/
│   ├── content-editor-v3.html  # Editor completo
│   ├── config.json              # Configuración
│   └── media-editor.html        # Gestión de media
│
├── admin/
│   ├── login.html          # Login admin
│   └── dashboard.html      # Panel admin
│
├── legal/
│   ├── TERMINOS-Y-CONDICIONES.html
│   ├── PRIVACIDAD.html
│   └── PROTECCION-FRAUDES.html
│
├── shipping/
│   ├── config.json         # Config de envíos
│   ├── shipping-calculator.js
│   └── shipping-estimator.html
│
└── assets/
    └── images/             # Carpeta para imágenes
```

---

## 🔧 Configuración Rápida

### Cambiar Texts/Colores
1. Abrir: https://cryptovh0.github.io/jois-leather/content/content-editor-v3.html
2. Seleccionar pestaña нужную
3. Editar y guardar (auto-guardado)

### Agregar Productos
1. Content Editor → Productos
2. Click en imagen placeholder
3. Subir foto real
4. Editar nombre, precio, descripción

### Agregar Usuarios Admin
1. Ir a GitHub → jois-leather repo
2. Editar admin/app-admin.js
3. Modificar array `ADMIN_USERS`:
```javascript
const ADMIN_USERS = [
    { user: 'admin', pass: 'jois2024' },
    { user: 'uriel', pass: 'TU NUEVA CONTRASEÑA' }
];
```

---

## 📧 Contactos & Links

| Servicio | Link | Status |
|----------|------|--------|
| Website | https://cryptovh0.github.io/jois-leather | ✅ Activo |
| GitHub | https://github.com/CryptoVH0/jois-leather | ✅ |
| Stripe | https://dashboard.stripe.com | ⏳ Necesitas registrarte |
| NOWPayments | https://nowpayments.io | ⏳ Necesitas registrarte |
| Domain | joisleather.io | ⏳ Comprar |

---

## 🆘 Soporte

**Para cambios en el código:**
- Editar archivos en `/home/ubuntu/.openclaw/workspace/jois-leather/`
- Commit + push a GitHub
- Auto-deploy en ~2 min

**Para contenido:**
- Usar Content Editor v3
- Cambios en localStorage (temporales)
- Para persistir, necesita backend real

---

*Última actualización: 2026-04-23*
