<template>
  <v-footer color="color-primary"> Fecha de estudio: {{ fechaEstudio }} </v-footer>
</template>

<script setup>
import { ref } from 'vue';
import moment from 'moment';

const fechaEstudio = ref(new moment());
</script>
