<template>
  <v-sheet class="pa-2" elevation="1" style="height: 100%; overflow-y: auto">
    <div class="grid-container">
      <!-- Iteramos sobre instanceIds por cada DicomThumbnail  -->
      <div v-for="item in instanceIds" :key="item" class="thumbnail-wrapper">
        <DicomThumbnail :imageId="getImageId(item) || ''" @select="$emit('select', item)" />
      </div>
    </div>
  </v-sheet>
</template>

<script>
import { useDicomStore } from '@/stores/dicomStore';
import DicomThumbnail from './DicomThumbnail.vue';

export default {
  name: 'GaleriaMiniatura',
  components: { DicomThumbnail },
  props: {
    instanceIds: { type: Array, default: () => [] }, // Recibimos los IDs de las imágenes
  },
  setup() {
    const dicomStore = useDicomStore(); // Usamos el store

    const getImageId = dicomStore.getImageId;

    return { getImageId }; // Regresamos getImageId para usarlo en el template
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-gap: 8px;
}

.thumbnail-wrapper {
  padding: 4px;
}
</style>
