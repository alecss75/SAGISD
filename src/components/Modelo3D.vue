<template>
  <v-sheet class="ma-2" height="300">
    <canvas ref="canvas3d" class="full-canvas"></canvas>
  </v-sheet>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'Modelo3D',
  mounted() {
    this.initScene();
    this.loadModel();
  },
  methods: {
    initScene() {
      const canvas = this.$refs.canvas3d;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 0, 200);

      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      this.renderer.setSize(width, height);

      // usa la clase importada directamente
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.25;

      this.animate();
    },
    loadModel() {
      const loader = new GLTFLoader();
      loader.load('/model/anatomical_model.gltf', gltf => {
        this.model = gltf.scene;
        this.scene.add(this.model);
      });
    },
    updateOrientation(md) {
      /* … */
    },
    animate() {
      requestAnimationFrame(this.animate);
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
