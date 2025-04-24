import dicomParser from 'dicom-parser';
import dcmjs from 'dcmjs';

export const useDicomStore = defineStore('dicomStorage', {
  state: () => ({
    dicomFiles: [],
    selectedId: null,
    isLoading: false,
    error: null,
    metadataMapping: [],
  }),

  getters: {
    selectedFile: state => state.dicomFiles.find(f => f.id === state.selectedId),
    allIds: state => state.dicomFiles.map(f => f.id),
    isReady: state => state.dicomFiles.length > 0 && !state.isLoading && !state.error,

    // Nuevo getter getImageId
    getImageId: state => {
      return instanceId => {
        if (!instanceId) {
          console.error('Instance ID no proporcionado');
          return ''; // Retorna una cadena vacía si no se proporciona un instanceId válido
        }

        const baseURL = import.meta.env.BASE_URL; // Base URL configurada
        const url = `${baseURL}dicoms/DICOMOBJ/${instanceId}.dcm`; // Generamos la URL
        const ts = Date.now(); // Para evitar cache, añadimos un parámetro único
        return `wadouri:${url}?t=${ts}`; // Devolvemos el imageId completo con el timestamp, sin el parámetro '_'
      };
    },
  },

  actions: {
    async loadDicomsFromAssets() {
      this.isLoading = true;
      try {
        const response = await fetch('/dicoms/dicoms.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        this.dicomFiles = data.files.map(file => {
          const id = file.replace(/\.[^/.]+$/, ''); // elimina la extensión
          const url = `/dicoms/DICOMOBJ/${file}`; // ruta completa para wadouri
          return { id, url };
        });

        this.error = null;
      } catch (err) {
        console.error('❌ Error al cargar los DICOMs:', err);
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
      const file = this.dicomFiles.find(f => f.id === id);
      if (file) file.metadata = metadata;
    },

    setThumbnail(id, thumbnail) {
      const file = this.dicomFiles.find(f => f.id === id);
      if (file) file.thumbnail = thumbnail;
    },

    async processDicom(imageId) {
      const cs = this.$cornerstone;
      const wado = this.$cornerstoneWADO;

      try {
        // Elimina el prefijo 'wadouri:' si está presente
        const rawUrl = imageId.replace(/^wadouri:/, '');
        const url = new URL(rawUrl, window.location.origin); // Generamos la URL completa
        url.searchParams.set('_', Date.now()); // Agregar un parámetro para evitar el caché

        const fetchUrl = url.href; // La URL final

        console.log('URL de la imagen DICOM a cargar:', fetchUrl); // Verifica que la URL esté bien formada

        // Descargar el archivo DICOM como ArrayBuffer
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}: No se pudo cargar el archivo DICOM`);

        let buffer = await res.arrayBuffer();
        console.log('Buffer DICOM cargado');

        // Verificar si el encabezado DICM está presente, y si no, aplicar makePart10
        const magic = String.fromCharCode(...new Uint8Array(buffer, 128, 4));
        console.log('Encabezado DICM:', magic); // Verifica si es 'DICM'

        if (magic !== 'DICM') {
          console.log('No tiene DICM, aplicando makePart10');
          buffer = await this.makePart10(buffer); // Si no tiene DICM, lo procesamos
        }

        // Crear un Blob con el buffer descargado
        const blob = new Blob([buffer], { type: 'application/dicom' });
        const blobUrl = URL.createObjectURL(blob); // Crear la URL para el Blob
        const fullImageId = `wadouri:${blobUrl}`; // Prefijo 'wadouri:' para Cornerstone

        console.log('Cargando imagen con ID:', fullImageId); // Verifica el imageId

        // Cargar la imagen con Cornerstone
        const image = await cs.loadImage(fullImageId);

        // Verificar si la imagen tiene dimensiones válidas
        if (!image || !image.width || !image.height) {
          throw new Error('La imagen DICOM no tiene dimensiones válidas');
        }

        return image; // Regresa la imagen cargada correctamente
      } catch (err) {
        console.error('Error al procesar DICOM:', err.message);
        this.error = `Error al procesar DICOM: ${err.message}`;
        return null; // Retornar null si ocurre un error
      }
    },

    getMetadata(id) {
      const file = this.dicomFiles.find(f => f.id === id); // Buscar el archivo por su id
      return file ? file.metadata : null; // Devolver los metadatos si se encuentran, de lo contrario null
    },

    async makePart10(buffer) {
      const byteArray = new Uint8Array(buffer);
      const dataSet = dicomParser.parseDicom(byteArray, {
        untilTag: 'x7FE0,0010',
        parsePart10Header: false,
      });
      const dicomData = dcmjs.data.DicomMessage.readFile(dataSet, {
        vrStrategy: 'transferSyntaxImplicitVRLittleEndian',
      });
      const meta = dcmjs.data.DicomMetaDictionary.createMetaHeader(
        dicomData.dict,
        dicomData._meta.TransferSyntaxUID || '1.2.840.10008.1.2'
      );
      return dcmjs.data.DicomMessage.write(dicomData.dict, meta);
    },
  },
});
