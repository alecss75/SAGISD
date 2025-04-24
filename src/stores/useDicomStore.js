export const useDicomStore = defineStore('dicomStorage', {
  state: () => ({
    dicomFiles: [], 
    selectedId: null,
    isLoading: false,
    error: null,
    metadataMapping: [], 
  }),

  getters: {
    selectedFile: (state) => state.dicomFiles.find((f) => f.id === state.selectedId),
    allIds: (state) => state.dicomFiles.map((f) => f.id),
    isReady: (state) => state.dicomFiles.length > 0 && !state.isLoading && !state.error,
  },

  actions: {
    async loadDicomsFromAssets() {
      this.isLoading = true;
      try {
        const modules = import.meta.glob('@/assets/dicoms/DICOMOBJ/*', {
          query: 'url',
          eager: true,
        });

        this.dicomFiles = Object.entries(modules).map(([path, url]) => {
          const id = path.split('/').pop().replace(/\.[^/.]+$/, '');
          return { id, url };
        });

        this.error = null;
      } catch (err) {
        this.error = 'Error al cargar los DICOMs: ' + err.message;
        this.dicomFiles = [];
      } finally {
        this.isLoading = false;
      }
    },

    select(id) {
      this.selectedId = id;
    },

    setMetadata(id, metadata) {
      const file = this.dicomFiles.find((f) => f.id === id);
      if (file) file.metadata = metadata;
    },

    setThumbnail(id, thumbnail) {
      const file = this.dicomFiles.find((f) => f.id === id);
      if (file) file.thumbnail = thumbnail;
    },

    getImageId(name) {
      const baseURL = import.meta.env.BASE_URL; 
      const url = `${baseURL}dicoms/DICOMOBJ/${name}.dcm`;
      const ts = Date.now(); // anti‐cache
      return `wadouri:${url}?t=${ts}`;
    },

    loadMetadata() {
      import('@/assets/metadata.json')
        .then((metadata) => {
          this.metadataMapping = metadata;
        })
        .catch((err) => {
          console.error('Error al cargar los metadatos:', err);
        });
    },

    getMetadata(id) {
      return this.metadataMapping.find((mtdt) => mtdt.id === id);
    },
  },
});
