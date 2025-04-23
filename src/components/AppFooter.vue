<template>
  <v-footer color="primary" height="50px"> Fecha de estudio: {{ fechaEstudio }} </v-footer>
</template>

<script setup>
import { ref } from 'vue';
import moment from 'moment';

const fechaEstudio = ref(new moment());
</script>
