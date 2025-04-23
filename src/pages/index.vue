<template>
  <div>
    <!-- Encabezado -->
    <AppBar> </AppBar>
    <!-- Cuerpo de la aplicación -->
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
    // onFileChange(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     const fileId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    //     this.imageId = 'wadouri:' + fileId;
    //     setTimeout(() => {
    //       this.loadImage();
    //     }, 100); // Espera breve para asegurar que el DOM esté renderizado
    //   }
    // },
    // loadImage() {
    //   const element = this.$refs.dicomElement;
    //   // Verificar si ya está habilitado
    //   if (!cornerstone.getEnabledElement(element)) {
    //     cornerstone.enable(element);
    //   }
    //   // Cargar y mostrar la imagen
    //   cornerstone
    //     .loadImage(this.imageId)
    //     .then(image => {
    //       cornerstone.displayImage(element, image);
    //       // Configurar herramientas básicas
    //       cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    //       cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });
    //       // Puedes agregar más herramientas si quieres
    //       // cornerstoneTools.addTool(cornerstoneTools.PanTool);
    //       // cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 4 });
    //     })
    //     .catch(error => {
    //       console.error('Error cargando imagen DICOM:', error);
    //     });
    // },
  },
};
</script>

<style scoped>
.dicom-container {
  width: 512px;
  height: 512px;
  border: 1px solid #ccc;
}
</style>
