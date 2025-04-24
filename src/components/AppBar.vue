<template>
  <v-app-bar color="#18611b" density="compact">
    <v-row class="w-100" align="center" no-gutters>
      <!-- Izquierda -->
      <v-col cols="4" class="text-left pl-4">
        <span class="text-white font-weight-medium">Hola, {{ nombreCliente }}</span>
      </v-col>

      <!-- Centro -->
      <v-col cols="4" class="text-center">
        <v-app-bar-title class="text-white">SAGISD</v-app-bar-title>
      </v-col>

      <!-- Derecha -->
      <v-col cols="4" class="text-right pr-4">
        <v-img
          :src="saludDignaLogo"
          max-height="36"
          width="auto"
          contain
          class="d-inline-block"
        />
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue';
import saludDignaLogo from '@/assets/saludDignaLogo.png'; // o pon la ruta correcta si viene de public

const nombreCliente = ref('Manuelito');
</script>
