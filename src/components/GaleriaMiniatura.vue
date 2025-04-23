<template>
  <v-sheet class="pa-2" max-height="600" elevation="1">
    <v-slide-group v-model="selected" show-arrows class="pa-2" active-class="selected-thumb">
      <template #default>
        <v-slide-group-item v-for="id in instanceIds" :key="id" :value="id">
          <DicomThumbnail :imageId="getImageId(id)" @select="$emit('select', id)" />
        </v-slide-group-item>
      </template>
    </v-slide-group>
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
  data() {
    return { selected: null };
  },
  methods: {
    getImageId,
  },
  watch: {
    selected(newId) {
      this.$emit('select', newId);
    },
  },
};
</script>

<style scoped>
.selected-thumb .thumb-canvas {
  outline: 2px solid #1976d2;
}
</style>
