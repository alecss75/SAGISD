<template>
  <div>
    <h3>Visor DICOM con CornerstoneJS</h3>
    <div ref="dicomElement" class="dicom-container"></div>
    <input type="file" @change="onFileChange" />
  </div>
</template>

<script>
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';


export default {
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
      cornerstone.loadImage(this.imageId).then(image => {
        cornerstone.displayImage(element, image);

        // Configurar herramientas básicas
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });

        // Puedes agregar más herramientas si quieres
        // cornerstoneTools.addTool(cornerstoneTools.PanTool);
        // cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 4 });
      }).catch(error => {
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
</style>
