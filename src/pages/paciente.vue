<template>
  <div>
    <!-- Encabezado -->
    <AppBar />

    <v-card outlined height="90vh">
      <v-row>
        <!-- Visor 2D -->
        <v-col md="5">
          <VisorPrincipal :imageId="currentImageId" />
        </v-col>

        <!-- Galería y Modelo 3D -->
        <v-col md="4">
          <GaleriaMiniatura :instanceIds="instanceIds" @select="onSelect" />
        </v-col>

        <!-- Barra de herramientas dinámica -->
        <v-col md="3">
          <v-card class="pa-2">
            <v-icon>mdi-trash</v-icon>
            <v-list density="compact">
              <v-list-subheader>Herramientas</v-list-subheader>

              <v-list-item
                v-for="(tool, i) in tools"
                :key="i"
                :value="tool"
                color="primary"
                @click="tool.action"
              >
                <template v-slot:prepend>
                  <v-icon :icon="tool.icon"></v-icon>
                </template>

                <v-list-item-title> {{ tool.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import AppBar from '@/components/AppBar.vue';
import VisorPrincipal from '@/components/VisorPrincipal.vue';
import GaleriaMiniatura from '@/components/GaleriaMiniatura.vue';

import { getInstanceIds, getImageId, getMetadata } from '@/services/dicomService';

export default {
  name: 'DicomViewer',
  components: {
    AppBar,
    VisorPrincipal,
    GaleriaMiniatura,
  },
  data() {
    return {
      instanceIds: [],
      currentImageId: null,
      currentMetadata: {},

      // Lista de herramientas personalizable
      tools: [
        {
          icon: 'mdi-download',
          label: 'Descargar actual',
          action: () => console.log('Zoom activado'),
        },
        {
          icon: 'mdi-download-multiple',
          label: 'Exportar todos',
          action: () => console.log('Herramienta de medición activada'),
        },
        {
          icon: 'mdi-share',
          label: 'Compartir',
          action: () => alert(JSON.stringify(this.currentMetadata, null, 2)),
        },
      ],
    };
  },
  mounted() {
    this.instanceIds = getInstanceIds();
  },
  methods: {
    async onSelect(name) {
      this.currentImageId = getImageId(name);
      this.currentMetadata = getMetadata(name);
    },
  },
};
</script>

<style scoped>
.hoverable {
  cursor: pointer;
  transition: background-color 0.2s;
}
.hoverable:hover {
  background-color: #f0f0f0;
}
</style>
