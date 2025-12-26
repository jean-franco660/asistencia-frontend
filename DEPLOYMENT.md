# Guía de Deployment - Frontend Vue.js

## Descripción
Esta guía cubre el proceso de deployment del dashboard web administrativo construido con Vue 3 + Vite.

## Opciones de Deployment

### Opción 1: Nginx en el mismo servidor EC2 (Recomendado)

Esta opción sirve el frontend desde el mismo servidor donde está el backend.

#### Paso 1: Build de Producción

En tu máquina local:
```bash
cd d:\practicas\asistencia-frontend
npm run build
```

Esto genera la carpeta `dist/` con los archivos optimizados.

#### Paso 2: Transferir a Servidor

```bash
# Comprimir build
tar -czf dist.tar.gz dist/

# Transferir al servidor (desde tu máquina local)
scp dist.tar.gz user@13.216.216.86:/var/www/

# En el servidor
ssh user@13.216.216.86
cd /var/www
tar -xzf dist.tar.gz
mv dist asistencia-frontend
```

#### Paso 3: Configurar Nginx

Crear archivo: `/etc/nginx/sites-available/asistencia-frontend`

```nginx
server {
    listen 80;
    server_name 13.216.216.86;
    
    # Frontend en la raíz
    location / {
        root /var/www/asistencia-frontend;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Proxy para API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Assets con caché largo
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/asistencia-frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Habilitar y recargar:
```bash
sudo ln -s /etc/nginx/sites-available/asistencia-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Paso 4: Actualizar .env.production

Si usas proxy de Nginx, puedes usar rutas relativas:
```env
VITE_API_BASE_URL=/api/v1/web
```

---

### Opción 2: Netlify / Vercel (Hosting Gratuito)

#### Netlify

1. **Instalar Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
```

2. **Build y Deploy**
```bash
cd d:\practicas\asistencia-frontend
npm run build
netlify deploy --prod
```

3. **Configurar Redirects**

Crear archivo `public/_redirects`:
```
/* /index.html 200
```

4. **Variables de Entorno en Netlify**
- Dashboard de Netlify > Site Settings > Environment Variables
- Agregar: `VITE_API_BASE_URL=http://13.216.216.86:8000/api/v1/web`

#### Vercel

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
vercel login
```

2. **Deploy**
```bash
cd d:\practicas\asistencia-frontend
vercel --prod
```

3. **Variables de Entorno**
- Dashboard de Vercel > Settings > Environment Variables
- Agregar: `VITE_API_BASE_URL=http://13.216.216.86:8000/api/v1/web`

---

### Opción 3: GitHub Pages

1. **Actualizar vite.config.js**
```js
export default defineConfig({
  base: '/nombre-repositorio/', // Si no es el repo principal
  // ... resto de configuración
})
```

2. **Deploy**
```bash
npm run deploy
```

El script `deploy` ya está configurado en `package.json` usando `gh-pages`.

---

## Configuración de Variables de Entorno

### Archivo .env.production
```env
# URL del backend de producción
VITE_API_BASE_URL=http://13.216.216.86:8000/api/v1/web
```

### Archivo .env.local (desarrollo)
```env
# URL del backend de desarrollo
VITE_API_BASE_URL=http://localhost:8000/api/v1/web
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build localmente
npm run preview

# Deploy a GitHub Pages
npm run deploy
```

## Verificación del Build

### 1. Build Local
```bash
npm run build
```

Verificar que no haya errores y que se genere la carpeta `dist/`.

### 2. Preview Local
```bash
npm run preview
```

Abrir `http://localhost:4173` y verificar:
- ✅ La aplicación carga correctamente
- ✅ El login funciona
- ✅ No hay errores en la consola del navegador
- ✅ Las llamadas a la API apuntan a la URL correcta
- ✅ Los assets (imágenes, fuentes) cargan correctamente

### 3. Verificar Optimización

Revisar el tamaño de los archivos generados:
```bash
ls -lh dist/assets/
```

Chunks esperados:
- `index-[hash].js` - Código principal
- `vendor-[hash].js` - Vue, Vue Router, Pinia
- `ui-[hash].js` - SweetAlert2, v-calendar
- `charts-[hash].js` - Chart.js
- `icons-[hash].js` - Iconos

## Actualización del Frontend

### Con Nginx (Opción 1)
```bash
# En tu máquina local
git pull
npm install
npm run build
tar -czf dist.tar.gz dist/

# Transferir y desplegar
scp dist.tar.gz user@13.216.216.86:/var/www/
ssh user@13.216.216.86
cd /var/www
rm -rf asistencia-frontend
tar -xzf dist.tar.gz
mv dist asistencia-frontend
```

### Con Netlify/Vercel
```bash
git pull
npm install
npm run build
netlify deploy --prod  # o vercel --prod
```

## Troubleshooting

### El frontend muestra pantalla blanca
- **Causa**: Error en el build o rutas incorrectas
- **Solución**: 
  - Verificar consola del navegador
  - Verificar `base` en `vite.config.js`
  - Verificar que los assets estén en `dist/`

### API calls fallan (CORS error)
- **Causa**: Backend no permite el origen
- **Solución**:
  - Verificar `CORS_ALLOWED_ORIGINS` en `.env` del backend
  - Agregar la URL del frontend
  - Ejemplo: `CORS_ALLOWED_ORIGINS="http://13.216.216.86,https://tu-dominio.netlify.app"`

### 404 en rutas al recargar
- **Causa**: Servidor no está configurado para SPA
- **Solución Nginx**: Ya incluido en la config (`try_files $uri $uri/ /index.html`)
- **Solución Netlify**: Archivo `_redirects` en `public/`
- **Solución Vercel**: Archivo `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Assets no cargan (404)
- **Causa**: `base` incorrecto en `vite.config.js`
- **Solución**: 
  - Para servidor propio: `base: '/'`
  - Para GitHub Pages: `base: '/nombre-repo/'`

## Consideraciones de Seguridad

### Producción con HTTPS
Si usas un dominio con SSL:

1. **Actualizar .env.production**
```env
VITE_API_BASE_URL=https://api.tudominio.com/api/v1/web
```

2. **Configurar Nginx con SSL**
```bash
sudo certbot --nginx -d tudominio.com
```

### Content Security Policy (Opcional)
Agregar headers en Nginx:
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
```

## Checklist Pre-Deployment

- [ ] `.env.production` configurado con URL correcta
- [ ] Build ejecutado exitosamente (`npm run build`)
- [ ] Preview testeado localmente (`npm run preview`)
- [ ] No hay errores en consola del navegador
- [ ] Login funciona correctamente
- [ ] Navegación entre páginas funciona
- [ ] Llamadas a API apuntan a producción
- [ ] CORS configurado en backend
- [ ] Assets cargan correctamente
- [ ] Rendimiento verificado (Lighthouse score)
