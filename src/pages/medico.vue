<!-- <template>
  <div>
    <AppBar> </AppBar>
    <v-card>
      <v-row>
        <v-col md="6">
          <VisorPrincipal></VisorPrincipal>
        </v-col>
        <v-col md="6">
          <v-row>
            <v-col md="12">
              <GaleriaMiniatura></GaleriaMiniatura>
            </v-col>
            <v-col md="12"> <Modelo3D></Modelo3D></v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import VisorPrincipal from '@/components/VisorPrincipal.vue';
import GaleriaMiniatura from '@/components/GaleriaMiniatura.vue';
import Modelo3D from '@/components/Modelo3D.vue';
export default {
  components: { VisorPrincipal, GaleriaMiniatura, Modelo3D },
  name: 'DicomViewer',
  data() {
    return {
      imageId: null,
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const fileId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        this.imageId = 'wadouri:' + fileId;
        setTimeout(() => {
          this.loadImage();
        }, 100); // Espera breve para asegurar que el DOM esté renderizado
      }
    },
    loadImage() {
      const element = this.$refs.dicomElement;
      // Verificar si ya está habilitado
      if (!cornerstone.getEnabledElement(element)) {
        cornerstone.enable(element);
      }
      // Cargar y mostrar la imagen
      cornerstone
        .loadImage(this.imageId)
        .then(image => {
          cornerstone.displayImage(element, image);
          // Configurar herramientas básicas
          cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
          cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });
          // Puedes agregar más herramientas si quieres
          cornerstoneTools.addTool(cornerstoneTools.PanTool);
          cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 4 });
        })
        .catch(error => {
          console.error('Error cargando imagen DICOM:', error);
        });
    },
  },
};
</script>

<style scoped>
.dicom-container {
  width: 512px;
  height: 512px;
  border: 1px solid #ccc;
}
</style> -->

<template>
  <div>
    <!-- Encabezado -->
    <AppBar />

    <v-card outlined height="90vh">
      <v-row>
        <!-- Visor 2D -->
        <v-col md="6">
          <!-- Pasa imageId directamente a tu componente VisorPrincipal -->
          <VisorPrincipal :imageId="currentImageId" />
        </v-col>

        <!-- Galería y Modelo 3D -->
        <v-col md="6">
          <v-row>
            <v-col md="12">
              <!-- La galería recibe todos los IDs y emite "select" con el nombre -->
              <GaleriaMiniatura :instanceIds="instanceIds" @select="onSelect" />
            </v-col>
            <v-col md="12">
              <!-- El modelo 3D usa los metadatos devueltos -->
              <!-- <Modelo3D :metadata="currentMetadata" /> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import AppBar from '@/components/AppBar.vue';
import VisorPrincipal from '@/components/VisorPrincipal.vue';
import GaleriaMiniatura from '@/components/GaleriaMiniatura.vue';
import Modelo3D from '@/components/Modelo3D.vue';

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

