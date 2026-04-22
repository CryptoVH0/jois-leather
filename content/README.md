# JOIS Content Management System

## Cómo usar el editor de contenidos

### 1. Acceder al editor
Abre: `content/editor.html`

O directamente desde el navegador:
```
tu-sitio.com/content/editor.html
```

---

### 2. Editar un texto

1. **Busca el código** en la lista de la derecha
2. **Click** en el texto que quieres cambiar
3. Se cargará automáticamente en el formulario de la izquierda
4. **Edita** el nuevo texto
5. Click **"Actualizar Texto"**
6. ¡Listo! El cambio se refleja inmediatamente

---

### 3. Códigos disponibles

#### Página Tienda (`index.html`)

| Código | Descripción |
|--------|-------------|
| `logo` | Logo principal (JOIS) |
| `nav_colecciones` | Link Colecciones |
| `nav_historia` | Link Historia |
| `nav_nft` | Link NFTs |
| `nav_contacto` | Link Contacto |
| `hero_title` | Título principal del hero |
| `hero_subtitle` | Subtítulo del hero |
| `hero_tagline` | Tagline del hero |
| `hero_description` | Descripción del hero |
| `hero_btn` | Botón del hero |
| `collections_title` | Título sección colecciones |
| `chamarras_title` | Título chamarras |
| `carteras_title` | Título carteras |
| `bolsos_title` | Título bolsos |
| `noir_name` | Nombre producto Noir |
| `noir_desc` | Descripción Noir |
| `story_title` | Título Nuestra Historia |
| `story_text` | Texto Historia |
| `contact_title` | Título Contacto |
| `contact_email` | Email de contacto |
| `contact_location` | Ubicación |
| `cart_title` | Título del carrito |
| `cart_checkout_usd` | Botón pago USD |
| `cart_checkout_crypto` | Botón pago Crypto |

#### Página NFTs (`nft.html`)

| Código | Descripción |
|--------|-------------|
| `hero_title` | Título hero NFT |
| `hero_subtitle` | Subtítulo hero |
| `hero_description` | Descripción hero |
| `hero_status` | Status del drop |
| `timer_label` | Label del countdown |
| `collection_title` | Título colección |
| `nft_jacket_noir` | Nombre NFT Noir |
| `nft_wallet_eclipse` | Nombre NFT Eclipse |
| `mint_btn` | Botón Mint |
| `step1_title` | Paso 1 |
| `step2_title` | Paso 2 |
| `step3_title` | Paso 3 |
| `step4_title` | Paso 4 |

---

### 4. Guardar cambios

Los cambios se guardan en el navegador (localStorage).

**Para exportar:**
1. Click **"Descargar texts.json"**
2. Sube el archivo a `content/texts.json` en GitHub

---

### 5. Añadir nuevos textos

Para añadir un nuevo texto editable:

1. Agrega el código y texto en `content/texts.json`:
```json
{
  "index": {
    "mi_nuevo_texto": "Este texto se puede editar"
  }
}
```

2. En el HTML, usa el atributo `data-content`:
```html
<p data-content="mi_nuevo_texto">Texto por defecto</p>
```

---

### 6. Estructura de archivos

```
content/
├── texts.json      ← Archivo con todos los textos (editable)
├── editor.html     ← Editor visual (para Uri)
└── app.js         ← Sistema que carga textos en las páginas
```

---

## Flujo de trabajo

1. **Uri edita** usando `editor.html`
2. **Descarga** `texts.json`
3. **Sube** a GitHub en la carpeta `content/`
4. **Las páginas** cargan automáticamente los textos

---

## Nota importante

El editor funciona **localmente en el navegador**. Para que los cambios se reflejen para todos los usuarios, hay que descargar el JSON y subirlo al repo de GitHub.

---

## Sistema de Media

### Editor de Media
Usa: `content/media-editor.html`

### Medidas recomendadas

| Tipo | Medida | Formato |
|------|--------|---------|
| Hero | 1920×1080 px | JPG 80% |
| Productos | 800×1200 px | JPG 80% |
| Colecciones | 600×800 px | JPG 80% |
| NFT Art | 1024×1024 px | PNG |
| Video Hero | 1920×1080 px | MP4 H.264 |

### Cómo funciona
1. **Subes** la imagen/video desde el editor
2. **Selecciona** el tipo y código de producto
3. **Se guarda** localmente en el navegador
4. **Para producción**: necesitas integrar con tu hosting
