<!-- src/components/MainViewer.vue -->
<template>
  <div ref="viewer" class="viewer-container"></div>
</template>

<script>
export default {
  name: 'VisorPrincipal',
  props: { instanceId: Number },
  watch: {
    instanceId: {
      immediate: true,
      handler(id) {
        if (!id) return;

        // 1. Construir la ruta al DICOM
        const idStr   = id.toString().padStart(7, '0');       // "00001"
        const fileName = `${idStr}.dcm`;                     // "00001.dcm"
        const url      = `${import.meta.env.BASE_URL}dicomobj/${fileName}`;  
        const imageId  = `wadouri:${url}`;                    
        console.log('Cargando DICOM desde →', imageId);

        // 2. Cargar con Cornerstone
        const cs  = this.$cornerstone;
        const cst = this.$cornerstoneTools;
        const el  = this.$refs.viewer;

        cs.enable(el);
        cs.loadImage(imageId)
          .then(img => {
            cs.displayImage(el, img);

            // Asegúrate de haber registrado antes las tools en main.js
            cst.mouseInput.enable(el);
            cst.setToolActive('Pan',  { mouseButtonMask: 2 });
            cst.setToolActive('Zoom', { mouseButtonMask: 4 });
            cst.setToolActive('Wwwc', { mouseButtonMask: 1 });
          })
          .catch(err => console.error('Error loadImage:', err));
      }
    }
  }
};
</script>
