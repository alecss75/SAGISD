<template>
    <div ref="canvas" class="thumb-canvas" @click="$emit('select')"></div>
  </template>
  
  <script>
  export default {
    name: 'DicomThumbnail',
    props: {
      imageId: { type: String, required: true }
    },
    mounted() {
      // Retrasa hasta el siguiente tick para que el ref exista
      this.$nextTick(() => {
        const cs = this.$cornerstone;      // <-- usa la instancia global
        const el = this.$refs.canvas;
  
        if (!cs) {
          console.error('Cornerstone no está disponible en this.$cornerstone');
          return;
        }
        if (!el) {
          console.error('DicomThumbnail: ref "canvas" no encontrado');
          return;
        }
  
        try {
          cs.enable(el);
        } catch (enableErr) {
          console.error('cornerstone.enable error:', enableErr);
          return;
        }
  
        console.log('Thumbnail loading →', this.imageId);
        cs.loadImage(this.imageId)
          .then(image => {
            cs.displayImage(el, image);
            console.log('✅ Miniatura mostrada correctamente');
          })
          .catch(err => console.error('Error cargando miniatura DICOM:', err));
      });
    }
  };
  </script>
  
  <style scoped>
  .thumb-canvas {
    width: 100px;
    height: 100px;
    background: black;
    cursor: pointer;
    margin: 4px;
  }
  </style>
  