<template>
  <div>
    <AppBar />

    <v-container fluid>
      <v-card outlined height="90vh" class="pa-2 d-flex flex-column">
        <v-row no-gutters class="fill-height">
          <!-- Visor Principal -->
          <v-col md="6" class="pa-2 fill-height d-flex flex-column">
            <VisorPrincipal :imageId="currentImageId" class="fill-height" />
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
          <v-col md="3" class="pa-2 fill-height d-flex flex-column">
            <v-card class="pa-2 fill-height d-flex flex-column" outlined>
              <v-icon>mdi-tools</v-icon>
              <v-list density="compact" class="flex-fill overflow-auto">
                <v-list-subheader>Herramientas</v-list-subheader>
                <v-list-item
                  v-for="(tool, i) in tools"
                  :key="i"
                  :value="tool"
                  color="primary"
                  @click="tool.action"
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
import { useDicomStore } from '@/stores/useDicomStore';

// Tu servicio dinámico que descubre los DICOM en assets y construye imageIds
import { getInstanceIds, getImageId, getMetadata } from '@/services/dicomService';

export default {
  name: 'DicomViewer',
  components: {
    AppBar,
    VisorPrincipal,
    GaleriaMiniatura,
    // Modelo3D,
  },
  data() {
    const dicomStore = useDicomStore();
    return {
      dicomStore,
      // instanceIds: [], // ["00000000","0000000A",...]
      // currentImageId: null, // "wadouri://…"
      // currentMetadata: {},

      tools: [
        {
          icon: 'mdi-download',
          label: 'Historico',
          action: () => console.log('Zoom activado'),
        },
        {
          icon: 'mdi-download-multiple',
          label: 'Zoom',
          action: () => console.log('Herramienta de medición activada'),
        },
        {
          icon: 'mdi-share',
          label: 'Regla',
          action: () => alert(JSON.stringify(this.currentMetadata, null, 2)),
        },
        {
          icon: 'mdi-share',
          label: 'Brillo',
          action: () => alert(JSON.stringify(this.currentMetadata, null, 2)),
        },
        {
          icon: 'mdi-share',
          label: 'Contraste',
          action: () => alert(JSON.stringify(this.currentMetadata, null, 2)),
        },
        {
          icon: 'mdi-share',
          label: 'Notas',
          action: () => alert(JSON.stringify(this.currentMetadata, null, 2)),
        },
        {
          icon: 'mdi-share',
          label: 'Bordes',
          action: () => alert(JSON.stringify(this.currentMetadata, null, 2)),
        },
        {
          icon: 'mdi-share',
          label: 'Mover',
          action: () => alert(JSON.stringify(this.currentMetadata, null, 2)),
        },
        {
          icon: 'mdi-share',
          label: 'Exportar',
          action: () => alert(JSON.stringify(this.currentMetadata, null, 2)),
        },
      ],
    };
  },
  async mounted() {
    await this.dicomStore.loadDicomsFromAssets(); // carga automática
    // this.instanceIds = getInstanceIds();
    // console.log(this.instanceIds) // sí funcionan
  },  
  methods: {
    async onSelect(id) {
      this.dicomStore.select(id);
      // Si quieres cargar metadatos dinámicamente aquí puedes hacerlo
      const metadata = await getMetadata(id);
      this.dicomStore.setMetadata(id, metadata);
    },
  },
  computed: {
    instanceIds() {
      return this.dicomStore.allIds;
    },
    currentImageId() {
      const selected = this.dicomStore.selectedFile;
      return selected ? `wadouri:${selected.url}` : null;
    },
    currentMetadata() { 
      const selected = this.dicomStore.selectedFile;
      return selected?.metadata || {};
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
