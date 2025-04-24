<template>
  <div class="thumbnail-wrapper">
    <!-- Canvas que mostrará la imagen procesada -->
    <canvas ref="canvas" class="thumb-canvas" @click="selectImage"></canvas>
  </div>
</template>

<script>
import { useDicomStore } from '@/stores/dicomStore'; // Importamos el store

export default {
  name: 'DicomThumbnail',
  props: {
    imageId: { type: String, required: true },
  },

  mounted() {
    this.loadDicom(); // Llamamos a la función para cargar la imagen al montar el componente
  },

  methods: {
    async loadDicom() {
      const dicomStore = useDicomStore();

      try {
        // Llamar a processDicom para cargar la imagen
        const image = await dicomStore.processDicom(this.imageId);
        console.log("Image loaded:", image);

        // Si es válido, dibujar la imagen
        console.log("",image)
        if (image && image.width && image.height) {
          this.drawImage(image);  // Llamamos a la función para dibujar la imagen en el canvas
        } else {
          throw new Error('Imagen no válida o error al cargarla');
        }
      } catch (err) {
        console.error('Error al cargar la imagen DICOM:', err);
      }
    },

    // Función para dibujar la imagen procesada en el canvas
    drawImage(image) {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');

      // Ajustamos el tamaño del canvas según la imagen procesada
      canvas.width = image.width;
      canvas.height = image.height;

      // Dibujamos la imagen en el canvas
      ctx.drawImage(image, 0, 0);
    },

    // Método para manejar el clic en el thumbnail
    selectImage() {
      this.$emit('select', this.imageId); // Emitimos el ID de la imagen seleccionada
    }
  },
};
</script>

<style scoped>
.thumbnail-wrapper {
  padding: 4px;
  cursor: pointer;
}

.thumb-canvas {
  width: 100%;
  height: 100%;
  background: black;
}
</style>
