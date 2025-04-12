import { defineStore } from 'pinia'

export const useStudyStore = defineStore('study', {
  state: () => ({
    files: {} as Record<string, Uint8Array>, // Archivos descomprimidos del ZIP
    labelText: '', // Contenido de LABEL.TXT
    dicomFilePaths: [] as string[], // Lista de paths DICOM detectados
  }),

  actions: {
    setFiles(files: Record<string, Uint8Array>) {
      this.files = files
    },

    setLabelText(text: string) {
      this.labelText = text
    },

    setDicomFilePaths(paths: string[]) {
      this.dicomFilePaths = paths
    },

    clear() {
      this.files = {}
      this.labelText = ''
      this.dicomFilePaths = []
    },
  },

  getters: {
    hasDICOMDIR: (state) => !!state.files['ESTUDIO_X/DICOMDIR'],
    numberOfImages: (state) => state.dicomFilePaths.length,
  },
})
