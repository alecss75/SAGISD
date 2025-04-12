<template>
  <v-container>
    <v-card class="pa-4" elevation="4">
      <v-card-title>Subir Estudio DICOM (.zip)</v-card-title>
      <v-card-text>
        <v-file-input
          v-model="zipFile"
          label="Selecciona un archivo ZIP"
          accept=".zip"
          prepend-icon="mdi-upload"
          @change="handleZipUpload"
          outlined
        />

        <v-divider class="my-4" />

        <div v-if="labelContent">
          <h3 class="text-h6">📄 Contenido de LABEL.TXT</h3>
          <v-card class="pa-3" color="grey lighten-4" outlined>
            <pre>{{ labelContent }}</pre>
          </v-card>
        </div>

        <div v-if="dicomFiles.length">
          <h3 class="text-h6 mt-4">
            🩻 Archivos DICOM detectados ({{ dicomFiles.length }})
          </h3>
          <v-list dense>
            <v-list-item v-for="file in dicomFiles" :key="file">
              <v-list-item-content>
                <v-list-item-title>{{ file }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { unzipSync, strFromU8 } from 'fflate'
import { useStudyStore } from '@/store/useStudyStore'

const zipFile = ref<File | null>(null)
const labelContent = ref('')
const dicomFiles = ref<string[]>([])
const store = useStudyStore()

function handleZipUpload(file: File) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const uint8Array = new Uint8Array(reader.result as ArrayBuffer)
    const files = unzipSync(uint8Array)

    // Guardar en el store global
    store.setFiles(files)

    // Leer LABEL.TXT
    if (files['ESTUDIO_X/LABEL.TXT']) {
      labelContent.value = strFromU8(files['ESTUDIO_X/LABEL.TXT'])
    }

    // Detectar archivos DICOM en DICOMOBJ/
    dicomFiles.value = Object.keys(files).filter(
      (key) =>
        key.startsWith('ESTUDIO_X/DICOMOBJ/') &&
        (key.toLowerCase().endsWith('.dcm') || !key.includes('.')) // por si no tienen extensión
    )
  }
  reader.readAsArrayBuffer(file)
}
</script>
