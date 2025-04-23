<template>
    <v-app-bar color="primary" density="compact" >
      <template v-slot:prepend >
        Hola, {{ nombreCliente }}
      </template>
      <v-app-bar-title class="text-center"> SAGISD </v-app-bar-title>
    </v-app-bar>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const nombreCliente = ref('Manuelito');
  
  </script>

  