<template>
    <v-sheet class="ma-2" height="300">
      <canvas ref="canvas3d" class="full-canvas"></canvas>
    </v-sheet>
  </template>
  
  <script>
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  
  export default {
    name: 'Modelo3D',
    props: { metadata: Object },
    mounted() {
      this.initScene();
      this.loadModel();
    },
    watch: {
      metadata: {
        deep: true,
        handler(md) { this.updateOrientation(md); }
      }
    },
    methods: {
      initScene() {
        const width = this.$refs.canvas3d.clientWidth;
        const height = this.$refs.canvas3d.clientHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
        this.camera.position.set(0, 0, 200);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.$refs.canvas3d, antialias: true });
        this.renderer.setSize(width, height);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
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
        if (!this.model) return;
        // Ejemplo: girar en torno a X/Y con base en meta.simulada
        const angle = (md.imagePositionPatient[2] / 100) * Math.PI;
        this.model.rotation.set(angle, 0, 0);
        // Resaltar región (simulado)
        this.model.traverse(child => {
          if (child.name === this.mapRegion(md.seriesDescription)) {
            child.material.opacity = 1;
          } else if (child.material) {
            child.material.opacity = 0.3;
          }
        });
      },
      mapRegion(desc) {
        const map = { 'Axial Cranial': 'Skull', 'Coronal Thorax': 'RibCage' };
        return map[desc] || 'WholeBody';
      },
      animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      }
    }
  };
  </script>
  
  <style scoped>
  .full-canvas { width: 100%; height: 100%; display: block; }
  </style>