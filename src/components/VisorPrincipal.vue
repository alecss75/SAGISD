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
        if (!id) {
          console.error('No se proporcionó un imageId válido');
          return;
        }

        const cs = this.$cornerstone;
        const el = this.$refs.viewer;

        // Habilitar el visor
        cs.enable(el);

        // Cargar la imagen y mostrarla en el visor
        cs.loadImage(id).then(function(image) {
          cs.displayImage(el, image);
        });

        // Habilitar eventos para mover (pan) y hacer zoom
        this.addPanAndZoom(el);
      },
    },
  },
  methods: {
    addPanAndZoom(el) {
      // Agregar eventos para hacer zoom
      const zoomInButton = document.getElementById('zoomIn');
      const zoomOutButton = document.getElementById('zoomOut');
      const resetButton = document.getElementById('reset');

      zoomInButton.addEventListener('click', function() {
        const viewport = this.$cornerstone.getViewport(el);
        viewport.scale += 0.25;
        this.$cornerstone.setViewport(el, viewport);
      });

      zoomOutButton.addEventListener('click', function() {
        const viewport = this.$cornerstone.getViewport(el);
        viewport.scale -= 0.25;
        this.$cornerstone.setViewport(el, viewport);
      });

      resetButton.addEventListener('click', function() {
        this.$cornerstone.reset(el);
      });

      // Agregar evento de mouse para mover (pan)
      el.addEventListener('mousedown', (e) => {
        let lastX = e.pageX;
        let lastY = e.pageY;

        function mouseMoveHandler(e) {
          const deltaX = e.pageX - lastX;
          const deltaY = e.pageY - lastY;
          lastX = e.pageX;
          lastY = e.pageY;

          const viewport = this.$cornerstone.getViewport(el);
          viewport.translation.x += deltaX / viewport.scale;
          viewport.translation.y += deltaY / viewport.scale;
          this.$cornerstone.setViewport(el, viewport);
        }

        function mouseUpHandler() {
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      });

      // Agregar eventos para hacer zoom con la rueda del ratón
      const mouseWheelEvents = ['mousewheel', 'DOMMouseScroll'];
      mouseWheelEvents.forEach(function(eventType) {
        el.addEventListener(eventType, function(e) {
          let viewport = this.$cornerstone.getViewport(el);
          if (e.wheelDelta < 0 || e.detail > 0) {
            viewport.scale -= 0.25;
          } else {
            viewport.scale += 0.25;
          }

          this.$cornerstone.setViewport(el, viewport);
          return false; // Prevenir que la página haga scroll
        });
      });
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
