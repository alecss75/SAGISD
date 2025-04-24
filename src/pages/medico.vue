<template>
  <div>
    <AppBar />

    <v-container fluid>
      <v-card outlined height="90vh" class="pa-2 d-flex flex-column" color="black">
        <v-row no-gutters class="fill-height">
          <!-- Visor Principal -->
          <v-col md="7" class="pa-2 fill-height d-flex flex-column">
            <VisorPrincipal
              :imageId="currentImageId"
              class="fill-height"
              :activeTool="activeTool"
            />
            <template>
              <v-sheet class="pa-2" height="600">
                <div ref="viewer" class="viewer-container"></div>

                <!-- Botones de Zoom y Reset -->
                <div>
                  <button id="zoomIn" class="btn btn-primary">Zoom In</button>
                  <button id="zoomOut" class="btn btn-primary">Zoom Out</button>
                  <button id="reset" class="btn btn-danger">Reset</button>
                </div>
              </v-sheet>
            </template>
          </v-col>

          <!-- Galería + Modelo 3D en columnas de 50% -->
          <v-col md="3" class="pa-2 fill-height d-flex flex-column">
            <div class="half-block overflow-auto mb-2">
              <GaleriaMiniatura :instanceIds="instanceIds" @select="onSelect" />
            </div>
            <div class="half-block overflow-auto">
              <Modelo3D :metadata="currentMetadata" />
            </div>
          </v-col>

          <!-- Herramientas -->
          <v-col md="2" class="pa-2 fill-height d-flex flex-column">
            <v-card class="pa-2 fill-height d-flex flex-column" outlined color="black">
              <v-icon>mdi-tools</v-icon>
              <v-list
                density="compact"
                class="flex-fill overflow-auto"
                style="background-color: #3d3b3b"
              >
                <v-list-subheader>Herramientas</v-list-subheader>
                <v-list-item
                  v-for="(tool, i) in tools"
                  :key="i"
                  :value="tool"
                  color="primary"
                  @click="setActiveTool(tool)"
                >
                  <template #prepend>
                    <v-icon :icon="tool.icon" />
                  </template>
                  <v-list-item-title>{{ tool.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import AppBar from '@/components/AppBar.vue';
import VisorPrincipal from '@/components/VisorPrincipal.vue';
import GaleriaMiniatura from '@/components/GaleriaMiniatura.vue';
import Modelo3D from '@/components/Modelo3D.vue';
import { useDicomStore } from '@/stores/dicomStore';

export default {
  name: 'DicomViewer',
  components: {
    AppBar,
    VisorPrincipal,
    GaleriaMiniatura,
    Modelo3D,
  },
  data() {
    const dicomStore = useDicomStore();
    return {
      dicomStore,
      activeTool: 'Pan', // Default tool
      tools: [
        { icon: 'mdi-pan', label: 'Pan', action: 'Pan' },
        { icon: 'mdi-zoom-in', label: 'Zoom', action: 'Zoom' },
        { icon: 'mdi-brightness-6', label: 'Brillo/Contraste', action: 'Wwwc' },
      ],
    };
  },
  async mounted() {
    await this.dicomStore.loadDicomsFromAssets();

    if (this.dicomStore.dicomFiles.length > 0) {
      const firstId = this.dicomStore.dicomFiles[0].id;
      this.dicomStore.select(firstId);
    }
  },
  methods: {
    setActiveTool(tool) {
      this.activeTool = tool.action;
      console.log(`Herramienta activa: ${this.activeTool}`);
    },
    onSelect(id) {
      console.log(id);
      this.dicomStore.select(id); // Selecciona el archivo DICOM en el store
      const metadata = this.dicomStore.getMetadata(id); // Obtiene los metadatos desde el store
      console.log('metadata', metadata);
      this.dicomStore.setMetadata(id, metadata); // Almacena los metadatos en el store
    },
  },
  computed: {
    instanceIds() {
      return this.dicomStore.allIds; // Accede a los IDs desde el store
    },
    currentImageId() {
      const selected = this.dicomStore.selectedFile;
      return selected?.url ? `wadouri:${selected.url}` : null;
    },
    currentMetadata() {
      const selected = this.dicomStore.selectedFile;
      return selected?.metadata || {}; // Accede a los metadatos del archivo seleccionado
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100%;
}
.flex-fill {
  flex: 1 1 auto;
}
.overflow-auto {
  overflow-y: auto;
}
.half-block {
  height: 50%;
}
</style>
