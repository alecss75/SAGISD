<template>
  <v-container>
    <v-card class="pa-4" elevation="3">
      <v-card-title>🩻 Visor DICOM 2D</v-card-title>
      <v-card-text>
        <div v-if="!imageDataUrl">
          <v-alert type="warning"
            >No se pudo cargar ninguna imagen DICOM.</v-alert
          >
        </div>
        <div v-else>
          <div ref="dicomElement" class="dicom-container"></div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import cornerstone from 'cornerstone-core'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import { useStudyStore } from '@/store/useStudyStore'

const dicomElement = ref<HTMLElement | null>(null)
const store = useStudyStore()
const imageDataUrl = ref<string | null>(null)

cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.dicomParser = dicomParser

onMounted(async () => {
  // Buscar primer archivo DICOM
  const firstPath = store.dicomFilePaths[0]
  const fileBytes = store.files[firstPath]
  if (!fileBytes) return

  // Crear blob para simular una imagen cargada desde archivo local
  const blob = new Blob([fileBytes], { type: 'application/dicom' })
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(blob)

  await nextTick()

  if (dicomElement.value) {
    cornerstone.enable(dicomElement.value)

    cornerstone
      .loadImage(imageId)
      .then((image) => {
        cornerstone.displayImage(dicomElement.value!, image)
      })
      .catch((err) => {
        console.error('Error cargando imagen DICOM:', err)
        imageDataUrl.value = null
      })
  }
})
</script>

<style scoped>
.dicom-container {
  width: 512px;
  height: 512px;
  border: 2px solid #ccc;
  margin-top: 20px;
}
</style>
