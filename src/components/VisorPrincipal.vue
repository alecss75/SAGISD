<!-- src/components/VisorPrincipal.vue -->
<template>
  <v-sheet class="pa-2" height="600">
    <div ref="viewer" class="viewer-container"></div>
  </v-sheet>
</template>

<script>
export default {
  name: 'VisorPrincipal',
  props: {
    imageId: { type: String, required: true },
  },
  watch: {
    imageId: {
      immediate: true,
      handler(id) {
        if (!id) return;
        const cs = this.$cornerstone;
        const cst = this.$cornerstoneTools;
        const el = this.$refs.viewer;

        // // Habilita el elemento
        cs.enable(el);
        
        // Registra y activa herramientas básicas
        cst.addTool(cst.PanTool);
        cst.addTool(cst.ZoomTool);
        cst.addTool(cst.WwwcTool);
        cst.setToolActive('Pan', { mouseButtonMask: 1 }); // botón izquierdo
        cst.setToolActive('Zoom', { mouseButtonMask: 2 }); // botón derecho
        cst.setToolActive('Wwwc', { mouseButtonMask: 4 }); // rueda del ratón

        // Carga y despliega la imagen
        cs.loadImage(id)
          .then(image => cs.displayImage(el, image))
          .catch(err => console.error('Cornerstone loadImage error:', err));
      },
    },
  },
  watch: {
    imageId: {
      immediate: true,
      handler(id) {
        if (!id) return;
        const el = this.$refs.viewer;
        this.$cornerstone.enable(el);
        this.$cornerstone
          .loadImage(id) // id ya tiene ?t=…
          .then(img => this.$cornerstone.displayImage(el, img))
          .catch(console.error);
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
