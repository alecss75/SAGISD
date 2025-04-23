<template>
  <div>
    <!-- Encabezado -->
    <AppBar />

    <v-card outlined height="90vh">
      <v-row v-if="paciente"></v-row>
      <v-row>
        <!-- Visor 2D -->
        <v-col md="6">
          <!-- Pasa imageId directamente a tu componente VisorPrincipal -->
          <VisorPrincipal :imageId="currentImageId" />
        </v-col>

        <!-- Galería y Modelo 3D -->
        <v-col md="6">
          <!-- La galería recibe todos los IDs y emite "select" con el nombre -->
          <GaleriaMiniatura :instanceIds="instanceIds" @select="onSelect" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import AppBar from '@/components/AppBar.vue';
import VisorPrincipal from '@/components/VisorPrincipal.vue';
import GaleriaMiniatura from '@/components/GaleriaMiniatura.vue';

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
    return {
      instanceIds: [], // ["00000000","0000000A",...]
      currentImageId: null, // "wadouri://…"
      currentMetadata: {},
    };
  },
  mounted() {
    this.instanceIds = getInstanceIds();
    // console.log(this.instanceIds) // sí funcionan
  },
  methods: {
    async onSelect(name) {
      // name es algo como "0000000A"
      this.currentImageId = getImageId(name);
      this.currentMetadata = getMetadata(name);
    },
  },
};
</script>
