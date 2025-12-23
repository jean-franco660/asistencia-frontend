# Sistema de Control de Asistencia - Frontend Web

Panel de administración web para el Sistema de Control de Asistencia de docentes, construido con Vue 3 + Vite + Tailwind CSS.

## 🚀 Características

- ✅ **Autenticación Multi-Rol**: Super Admin, Administrador y Supervisor
- ✅ **Dashboard Interactivo**: Estadísticas en tiempo real con gráficos
- ✅ **Gestión de Instituciones**: CRUD completo con importación/exportación Excel
- ✅ **Gestión de Usuarios**: Docentes, Supervisores y Administradores
- ✅ **Provisioning**: Conversión de usuarios app a supervisores
- ✅ **Horarios**: Configuración de turnos laborales por institución
- ✅ **Feriados**: Gestión de feriados nacionales e institucionales
- ✅ **Asistencias**: Visualización, filtrado y revisión de marcaciones
- ✅ **Justificaciones**: Aprobación y rechazo con comentarios
- ✅ **Importación Masiva**: Carga de docentes e instituciones desde Excel
- ✅ **Exportación**: Reportes detallados en Excel
- ✅ **Auditoría**: Visualización de logs de cambios (Super Admin)
- ✅ **Tema Oscuro**: Soporte completo con persistencia
- ✅ **Diseño Glassmorphic**: UI moderna y atractiva
- ✅ **Responsive**: Adaptado para móvil, tablet y desktop
- ✅ **Vista de Perfil**: Información personal para supervisores

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- Backend API en ejecución (`asistencia-backend`)

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/jean-franco660/asistencia-frontend.git
cd asistencia-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env y configurar la URL del backend
VITE_API_BASE_URL=http://localhost:8000/api/v1/web
```

## 🚀 Desarrollo

Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Producción

### Build

Generar build de producción:
```bash
npm run build
```

Los archivos compilados estarán en el directorio `dist/`.

### Preview

Previsualizar el build de producción localmente:
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
asistencia-frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/         # Recursos (imágenes, estilos)
│   ├── components/     # Componentes reutilizables
│   │   ├── layout/    # Layout (Navbar, Sidebar, Footer)
│   │   ├── features/  # Componentes por feature
│   │   └── usuarios/  # Componentes de usuarios
│   ├── composables/   # Composables de Vue
│   │   └── usuarios/  # Lógica reutilizable de usuarios
│   ├── router/        # Configuración de Vue Router
│   ├── services/      # Servicios API y utilidades
│   ├── store/         # Estado global (Pinia)
│   ├── utils/         # Utilidades y helpers
│   ├── views/         # Vistas/Páginas por módulo
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── usuarios/
│   │   ├── instituciones/
│   │   ├── asistencias/
│   │   ├── perfil/
│   │   └── ...
│   ├── App.vue        # Componente raíz
│   └── main.js        # Punto de entrada
├── .env.example       # Ejemplo de variables de entorno
├── index.html        # HTML principal
├── package.json      # Dependencias y scripts
├── tailwind.config.js # Configuración de Tailwind CSS
└── vite.config.js    # Configuración de Vite
```

## 🔐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base del backend API | `http://localhost:8000/api/v1/web` |

**Importante**: Nunca commitear archivos `.env` al repositorio.

## 🎨 Tecnologías

- **Vue 3** - Framework progresivo de JavaScript (Composition API)
- **Vite** - Build tool y dev server ultra rápido
- **Vue Router** - Enrutamiento con guards de autenticación
- **Pinia** - Gestión de estado moderna
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP con interceptores
- **SweetAlert2** - Alertas y modales elegantes
- **Chart.js** - Gráficos interactivos
- **Heroicons** - Iconos SVG optimizados
- **SheetJS (xlsx)** - Importación/Exportación Excel

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción optimizado
npm run preview  # Preview del build de producción
```

## 🔒 Seguridad

- Tokens JWT almacenados en localStorage
- Rutas protegidas con guards de navegación
- Validación de roles en cada ruta
- Interceptores Axios para sesiones expiradas
- Variables de entorno para configuración sensible
- Sanitización de inputs en formularios
- Rate limiting en el backend

## 👥 Roles y Permisos

### Super Admin
- Acceso completo al sistema
- Gestión de administradores
- Acceso a logs de auditoría
- Dashboard global

### Administrador
- Gestión de supervisores y docentes
- Gestión de instituciones
- Configuración de horarios y feriados
- Importación/Exportación masiva
- Dashboard administrativo

### Supervisor (Director)
- Vista de perfil personal
- Gestión de docentes de sus instituciones
- Visualización de asistencias filtradas
- Aprobación/rechazo de justificaciones
- Dashboard de su institución(es)
- Exportación de reportes de sus instituciones

## 🌐 Despliegue

### Configuración para Producción

1. Actualizar `.env.production` con la URL del backend en producción:
```env
VITE_API_BASE_URL=https://api.tu-dominio.com/api/v1/web
```

2. Generar el build:
```bash
npm run build
```

3. Los archivos en `dist/` están listos para ser desplegados en cualquier servidor web estático (Nginx, Apache, Netlify, Vercel, etc.)

### Nginx (Ejemplo)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/asistencia-frontend/dist;
    index index.html;

    # Compresión Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🎨 Características de UI/UX

### Diseño Glassmorphic
- Efectos de vidrio esmerilado
- Gradientes suaves
- Sombras y bordes sutiles
- Transiciones fluidas

### Tema Oscuro/Claro
- Toggle en navbar
- Persistencia en localStorage
- Transiciones suaves entre temas
- Colores optimizados para cada modo

### Componentes Reutilizables
- Sistema de diseño consistente
- Composables para lógica compartida
- Componentes feature-based organization

## 🐛 Solución de Problemas

### Error: VITE_API_BASE_URL is not defined
- Verificar que existe el archivo `.env` en la raíz
- Asegurarse de que la variable está definida correctamente
- Reiniciar el servidor después de cambiar `.env`

### Error 401 (No autorizado)
- Verificar que el backend está en ejecución
- Comprobar que la URL del API es correcta
- Limpiar localStorage y volver a iniciar sesión

### Problemas de CORS
- Configurar CORS en el backend Laravel
- Permitir el origen del frontend
- Desarrollo: `http://localhost:5173`
- Producción: tu dominio real

### Problemas con el build
```bash
# Limpiar node_modules y reinstalar
rm-rf node_modules package-lock.json
npm install

# Limpiar caché de Vite
npx vite --clearScreen
```

## 📊 Módulos Principales

- **Dashboard**: Estadísticas y gráficos en tiempo real
- **Usuarios**: Gestión CRUD de docentes con asignaciones
- **Instituciones**: CRUD con geolocalización
- **Horarios**: Configuración de turnos laborales
- **Asistencias**: Visualización y revisión de marcaciones
- **Justificaciones**: Gestión de solicitudes
- **Supervisores**: Listado y provisioning
- **Auditoría**: Logs de cambios (Super Admin)
- **Perfil**: Vista personal para supervisores

## 📝 Changelog

### v1.2.0 (2025-12-23)
- ✅ Vista de perfil para supervisores
- ✅ Eliminada opción de configuración del menú
- ✅ Filtro de instituciones para supervisores
- ✅ Exclusión de supervisor de su propia lista
- ✅ Corrección de duplicado de iconos en navbar
- ✅ Sidebar colapsable en todas las resoluciones

### v1.1.0 (2025-12-20)
- ✅ Sistema de revisión de asistencias (Fase 6)
- ✅ Navegación entre marcaciones
- ✅ Generación automática de contraseñas en importación
- ✅ Mejoras en formularios de usuario

### v1.0.0 (2025-12-14)
- ✅ Sistema base completo
- ✅ Autenticación multi-rol
- ✅ Dashboard con gráficos
- ✅ CRUD de todos los módulos
- ✅ Importación/Exportación Excel
- ✅ Tema oscuro

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🤝 Contribución

Para contribuir al proyecto:
1. Crear una rama desde `main`
2. Hacer los cambios necesarios
3. Crear un Pull Request con descripción detallada
4. Esperar revisión y aprobación

---

**Versión:** 1.2.0  
**Última actualización:** 23 de diciembre de 2025  
**Desarrollado con:** Vue 3 + Vite + Tailwind CSS
