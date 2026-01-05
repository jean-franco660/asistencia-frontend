# 📘 Manual de Despliegue a Producción - Frontend
## Sistema de Control de Asistencias - Dashboard Web

> Este README contiene las instrucciones para desplegar el dashboard administrativo Vue.js en producción, especialmente en servidores con cPanel.

---

## 🚀 Despliegue Rápido en cPanel

### Paso 1: Configurar Variables de Entorno

Editar `.env.production`:

```env
VITE_API_BASE_URL=https://api.sudominio.com/api/v1/web
```

### Paso 2: Generar Build de Producción

En su computadora:

```bash
# Instalar dependencias (si es necesario)
npm install

# Generar build optimizado
npm run build
```

Esto crea la carpeta `dist/` con todos los archivos listos para producción.

### Paso 3: Subir al Servidor

1. Comprimir todo el contenido de la carpeta `dist/` en `frontend.zip`
2. En cPanel → **Administrador de Archivos**
3. Crear o navegar a `public_html/admin` (o la carpeta de su dominio)
4. Subir y extraer `frontend.zip`
5. Eliminar el archivo zip

### Paso 4: Configurar Subdominio (Recomendado)

1. En cPanel → **Subdominios**
2. Crear subdominio: `admin`
3. Raíz del documento: `public_html/admin`

### Paso 5: Configurar .htaccess

Crear/editar el archivo `.htaccess` en la carpeta del frontend:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Compresión
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/x-javascript application/json
</IfModule>

# Caché del navegador
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Paso 6: Verificar

1. Visite: `https://admin.sudominio.com`
2. Debe ver la página de login
3. Inicie sesión con:
   - **Email**: `admin@admin.com`
   - **Password**: `password123`

---

## 🔄 Actualización

Cuando haya cambios:

```bash
# En su computadora
npm run build

# Comprimir dist/ y subir al servidor
# Extraer y reemplazar archivos
```

Limpie caché del navegador: `Ctrl + F5`

---

## ⚙️ Scripts Disponibles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 🌐 Configuración de Entornos

### Desarrollo Local (`.env.local`)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1/web
```

### Producción (`.env.production`)
```env
VITE_API_BASE_URL=https://api.sudominio.com/api/v1/web
```

---

## 🐛 Solución de Problemas

### Pantalla Blanca

1. Presione `F12` → Consola para ver errores
2. Verifique que `index.html` exista en la raíz
3. Verifique que `.htaccess` esté configurado

### CORS Error

El backend debe tener configurado:
```env
CORS_ALLOWED_ORIGINS="https://admin.sudominio.com"
```

### 404 al Recargar Página

El archivo `.htaccess` es necesario para que Vue Router funcione correctamente.

### Assets No Cargan

Verifique en `vite.config.js`:
```js
export default defineConfig({
  base: '/',  // Para hosting en raíz
  // ...
})
```

---

## 📦 Tecnologías

- **Vue 3.5** - Framework progresivo
- **Vite 6** - Build tool ultra-rápido
- **Pinia** - State management
- **Vue Router 4** - Enrutamiento
- **Tailwind CSS** - Styling
- **SweetAlert2** - Alertas modernas
- **Chart.js** - Gráficos
- **V-Calendar** - Calendarios

---

## 📝 Requisitos

- **Node.js**: 18+
- **npm**: 9+

---

## 📚 Documentación Completa

Para instrucciones detalladas:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía técnica completa
- [README.md](../README.md) - Manual general del sistema

---

## 🎨 Estructura del Build

Después de `npm run build`:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js       # App principal
│   ├── vendor-[hash].js      # Vue, Router, Pinia
│   ├── ui-[hash].js          # Componentes UI
│   ├── charts-[hash].js      # Chart.js
│   └── index-[hash].css      # Estilos
└── .htaccess                 # Configuración servidor
```

---

**Sistema de Control de Asistencias © 2026**
