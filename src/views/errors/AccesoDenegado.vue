<!-- src/views/errors/AccesoDenegado.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <svg class="mx-auto h-24 w-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        Acceso Denegado
      </h1>
      
      <p class="text-gray-600 mb-8">
        No tienes permisos para acceder a esta sección.
      </p>
      
      <button
        @click="$router.push('/dashboard')"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Volver al Dashboard
      </button>
    </div>
  </div>
</template>
