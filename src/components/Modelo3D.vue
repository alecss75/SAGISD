<template>
  <v-sheet class="ma-2" height="300" style="max-width: 100%">
    <canvas ref="canvas3d" class="full-canvas"></canvas>
  </v-sheet>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'Modelo3D',
  props: {
    metadata: {
      type: Object,
      default: () => ({}), // 1) Por defecto un objeto vacío
    },
  },

  mounted() {
    this.initScene();
    this.loadModel();

    // 3) Vinculamos animate al contexto antes de usarlo
    this.animate = this.animate.bind(this);
    this.animate();
  },

  watch: {
    metadata: {
      deep: true,
      handler(md) {
        this.updateOrientation(md);
      },
    },
  },

  methods: {
    initScene() {
      const width = this.$refs.canvas3d.clientWidth;
      const height = this.$refs.canvas3d.clientHeight;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x202020);

      // Cámara
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 0, 200);
      this.camera.lookAt(0, 0, 0);

      // Luz ambiente suave
      const ambient = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
      ambient.position.set(0, 200, 0);
      this.scene.add(ambient);

      // Luz direccional fuerte
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
      dirLight.position.set(0, 200, 100);
      this.scene.add(dirLight);

      // Renderer y controles
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.canvas3d,
        antialias: true,
      });
      this.renderer.setSize(width, height);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    loadModel() {
      const loader = new GLTFLoader();
      loader.load(
        '/model/head.gltf',
        gltf => {
          this.model = gltf.scene;
          const box = new THREE.Box3().setFromObject(this.model);
          const size = box.getSize(new THREE.Vector3()).length();
          const scale = 100 / size;
          this.model.scale.setScalar(scale);
          box.getCenter(this.model.position).multiplyScalar(-1);
          this.scene.add(this.model);
          this.scene.add(new THREE.AxesHelper(50));
          this.updateOrientation(this.metadata);
        },
        undefined,
        err => console.error('Error cargando GLTF:', err)
      );
    },

    updateOrientation(md) {
      if (!this.model) return;

      // 2) Protegemos el acceso a campos que tal vez no existan
      if (md.imagePositionPatient && Array.isArray(md.imagePositionPatient)) {
        const angle = (md.imagePositionPatient[2] / 100) * Math.PI;
        this.model.rotation.set(angle, 0, 0);
      }

      if (md.seriesDescription) {
        const target = this.mapRegion(md.seriesDescription);
        this.model.traverse(child => {
          if (child.material) {
            child.material.transparent = true;
            child.material.opacity = child.name === target ? 1 : 0.3;
          }
        });
      }
    },

    mapRegion(desc) {
      const map = {
        'Axial Cranial': 'Skull',
        'Coronal Thorax': 'RibCage',
      };
      return map[desc] || 'WholeBody';
    },

    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style scoped>
.full-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
