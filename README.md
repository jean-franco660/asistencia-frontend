# Sistema de Control de Asistencia - Frontend

Panel de administración web para el Sistema de Control de Asistencia de docentes, construido con Vue 3 + Vite.

## 🚀 Características

- **Autenticación y Autorización**: Sistema de login con roles (Administrador/Director)
- **Gestión de Instituciones**: CRUD completo de instituciones educativas
- **Gestión de Usuarios**: Administración de docentes y usuarios web
- **Horarios**: Configuración de turnos y horarios por institución
- **Feriados**: Gestión de feriados nacionales e institucionales
- **Asistencias**: Visualización y análisis de registros de asistencia
- **Dashboard**: Estadísticas y gráficos en tiempo real
- **Tema Oscuro**: Soporte completo para modo oscuro

## 📋 Requisitos Previos

- Node.js 16.x o superior
- npm 8.x o superior
- Backend API en ejecución

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd vue-admin-frontend
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
vue-admin-frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/         # Recursos (imágenes, estilos)
│   ├── components/     # Componentes reutilizables
│   │   ├── layout/    # Componentes de layout (Navbar, Sidebar, Footer)
│   │   └── ui/        # Componentes UI (Buttons, Inputs, Modals, etc.)
│   ├── router/        # Configuración de Vue Router
│   ├── services/      # Servicios API
│   ├── store/         # Estado global (Pinia)
│   ├── utils/         # Utilidades y helpers
│   ├── views/         # Vistas/Páginas
│   ├── App.vue        # Componente raíz
│   ├── main.js        # Punto de entrada
│   └── style.css      # Estilos globales
├── .env.example       # Ejemplo de variables de entorno
├── .gitignore        # Archivos ignorados por Git
├── index.html        # HTML principal
├── package.json      # Dependencias y scripts
├── tailwind.config.js # Configuración de Tailwind CSS
└── vite.config.js    # Configuración de Vite
```

## 🔐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base del backend API | `http://localhost:8000/api/v1/web` |

**Importante**: Nunca commitear archivos `.env` o `.env.production` al repositorio.

## 🎨 Tecnologías

- **Vue 3** - Framework progresivo de JavaScript
- **Vite** - Build tool y dev server
- **Vue Router** - Enrutamiento
- **Pinia** - Gestión de estado
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP
- **SweetAlert2** - Alertas y modales elegantes
- **Chart.js** - Gráficos y visualizaciones
- **Heroicons** - Iconos
- **V-Calendar** - Componente de calendario

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build de producción
```

## 🔒 Seguridad

- Las credenciales y tokens se almacenan en localStorage
- Todas las rutas protegidas requieren autenticación
- Validación de roles en cada ruta
- Interceptores de Axios para manejo de sesiones expiradas
- Variables de entorno para configuración sensible

## 🌐 Despliegue

### Configuración para Producción

1. Actualizar `.env.production` con la URL del backend en producción:
```env
VITE_API_BASE_URL=https://tu-dominio.com/api/v1/web
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
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 👥 Roles y Permisos

### Administrador
- Acceso completo a todas las funcionalidades
- Gestión de instituciones
- Gestión de usuarios web (directores/admins)
- Gestión de feriados nacionales
- Vista global de todas las asistencias

### Director
- Gestión de docentes de su institución
- Configuración de horarios institucionales
- Gestión de feriados institucionales
- Vista de asistencias de su institución

## 🐛 Solución de Problemas

### Error: VITE_API_BASE_URL is not defined
- Verificar que existe el archivo `.env` en la raíz del proyecto
- Asegurarse de que la variable está definida correctamente
- Reiniciar el servidor de desarrollo después de cambiar `.env`

### Error 401 (No autorizado)
- Verificar que el backend está en ejecución
- Comprobar que la URL del API es correcta
- Limpiar localStorage y volver a iniciar sesión

### Problemas de CORS
- Configurar CORS en el backend para permitir el origen del frontend
- En desarrollo: `http://localhost:5173`
- En producción: tu dominio real

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🤝 Contribución

Para contribuir al proyecto:
1. Crear una rama desde `main`
2. Hacer los cambios necesarios
3. Crear un Pull Request con descripción detallada
4. Esperar revisión y aprobación

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.
