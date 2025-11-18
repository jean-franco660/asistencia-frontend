<template>
  <!-- Sidebar lateral -->
  <aside
    v-if="auth.user"
    :class="sidebarClasses"
    class="fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300"
    role="navigation"
    aria-label="Menú lateral"
  >
    <nav class="h-full overflow-y-auto p-4">
      <ul class="space-y-2">
        <li v-for="item in filteredMenuItems" :key="item.name">
          <router-link
            :to="item.path"
            :class="getLinkClasses(item.path)"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>

  <!-- Fondo oscuro móvil -->
  <div
    v-if="isOpen"
    @click="closeSidebar"
    class="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity"
    aria-hidden="true"
  ></div>
</template>

<script setup>
import { computed, h } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";

const props = defineProps({
  isOpen: { type: Boolean, default: true },
});
const emit = defineEmits(["close"]);
const route = useRoute();
const auth = useAuthStore();

// ======================================================
// 🎯 Menú dinámico según rol
// ======================================================
const menuItems = [
  // --- Comunes ---
  {
    name: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    roles: ["admin"],
    icon: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d:
            "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        }),
      ]),
  },

  {
    name: "dashboard-director",
    label: "Dashboard",
    path: "/director/dashboard",
    roles: ["director"],
    icon: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d:
            "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        }),
      ]),
  },

  {
    name: "usuarios",
    label: "Docentes",
    path: "/usuarios",
    roles: ["admin", "director"],
    icon: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d:
            "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zM13 7a4 4 0 11-8 0 4 4 0 018 0z",
        }),
      ]),
  },
  {
    name: "instituciones",
    label: "Instituciones",
    path: "/instituciones",
    roles: ["admin"],
    icon: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d:
            "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-6 4h1m4 0h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
        }),
      ]),
  },
  {
    name: "horarios",
    label: "Horarios",
    path: "/horarios",
    roles: ["admin", "director"],
    icon: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 8v4l3 3m6-3A9 9 0 113 12a9 9 0 0118 0z",
        }),
      ]),
  },
  {
    name: "directores",
    label: "Directores",
    path: "/directores",
    roles: ["admin"],
    icon: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d:
            "M12 4.354a4 4 0 110 5.292M13 7a4 4 0 11-8 0 4 4 0 018 0zM15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197",
        }),
      ]),
  },
  {
    name: "administradores",
    label: "Administradores",
    path: "/administradores",
    roles: ["admin"],
    icon: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d:
            "M12 4.354a4 4 0 110 5.292M13 7a4 4 0 11-8 0 4 4 0 018 0zM15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197",
        }),
      ]),
  },

  // --- Director ---
  {
    name: "asistencias",
    label: "Asistencias",
    path: "/asistencias",
    roles: ["director", "admin"],
    icon: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d:
            "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M12 3a2 2 0 012 2v2a2 2 0 01-2 2M12 3a2 2 0 00-2 2v2a2 2 0 002 2m-2 6l2 2 4-4",
        }),
      ]),
  },
  {
    name: "feriados",
    label: "Feriados",
    path: "/feriados",
    roles: ["admin", "director"],
    icon: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d:
            "M8 7V3m8 4V3m-9 8h10m-11 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z",
        }),
      ]),
  },
];

// ======================================================
// 🔒 Filtrar por rol del usuario
// ======================================================
const filteredMenuItems = computed(() => {
  const rol = auth.user?.rol;
  return menuItems.filter((item) => item.roles.includes(rol));
});

// ======================================================
// 🎨 Clases dinámicas
// ======================================================
const sidebarClasses = computed(() => {
  const base = "w-64";
  const mobile = props.isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0";
  return [base, mobile];
});

const getLinkClasses = (path) => {
  const isActive = route.path === path;
  return isActive
    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
};

// ======================================================
// 📱 Cerrar sidebar en modo móvil
// ======================================================
const closeSidebar = () => emit("close");
</script>
