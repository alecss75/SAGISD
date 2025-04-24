<template>
  <v-sheet class="pa-2" height="600">
    <div ref="viewer" class="viewer-container"></div>
  </v-sheet>
</template>

<script>
export default {
  name: 'VisorPrincipal',
  props: {
    imageId: { type: String, required: true, default: '' },
  },
  watch: {
    imageId: {
      immediate: true,
      handler(id) {
        // Verificamos que imageId no sea null o vacío
        if (!id) {
          console.error('No se proporcionó un imageId válido');
          return;
        }

        const cs = this.$cornerstone;
        const cst = this.$cornerstoneTools;
        const el = this.$refs.viewer;

        // Habilitar el elemento de visualización
        cs.enable(el);

        // Registra y activa herramientas básicas
        cst.addTool(cst.PanTool);
        cst.addTool(cst.ZoomTool);
        cst.addTool(cst.WwwcTool);
        cst.setToolActive('Pan', { mouseButtonMask: 1 }); // botón izquierdo
        cst.setToolActive('Zoom', { mouseButtonMask: 2 }); // botón derecho
        cst.setToolActive('Wwwc', { mouseButtonMask: 4 }); // rueda del ratón

        // Cargar y desplegar la imagen usando el imageId
        cs.loadImage(id)
          .then(image => {
            cs.displayImage(el, image);
          })
          .catch(err => {
            console.error('Error al cargar la imagen con Cornerstone:', err);
          });
      },
    },
  },
};
</script>

<style scoped>
.viewer-container {
  width: 100%;
  height: 100%;
  background: black;
}
</style>
