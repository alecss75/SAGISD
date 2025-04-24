<template>
  <v-sheet class="pa-2" elevation="1" style="height: 100%; overflow-y: auto;">
    <div class="grid-container">
      <div v-for="item in instanceIds" :key="item" class="thumbnail-wrapper">
        <DicomThumbnail
          :imageId="getImageId(item)"
          @select="$emit('select', item)"
        />
      </div>
    </div>
  </v-sheet>
</template>

<script>
import DicomThumbnail from './DicomThumbnail.vue';
import { getImageId } from '@/services/dicomService';

export default {
  name: 'GaleriaMiniatura',
  components: { DicomThumbnail },
  props: {
    instanceIds: { type: Array, default: () => [] },
  },
  methods: {
    getImageId,
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
