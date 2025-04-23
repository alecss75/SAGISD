<template>
    <v-sheet class="pa-2" max-height="600" elevation="1">
      <v-list dense nav>
        <v-list-item
          v-for="id in instanceIds"
          :key="id"
          @click="$emit('select', id)"
          class="thumb-item"
        >
          <v-img
            :src="`/assets/thumbs/${id}.jpg`"
            width="100"
            height="100"
            contain
          />
        </v-list-item>
      </v-list>
    </v-sheet>
  </template>
  
  <script>
  export default {
    name: 'GaleriaMiniatura',
    props: {
      instanceIds: { type: Array, default: () => [1,2,3,4,5] }
    }
  };
  </script>
  
  <style scoped>
  .thumb-item { cursor: pointer; }
  </style>