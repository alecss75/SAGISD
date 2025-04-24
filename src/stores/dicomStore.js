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
        const modules = import.meta.glob('@/public/dicoms/DICOMOBJ/*', {
          query: 'url',
          eager: true,
        });

        this.dicomFiles = Object.entries(modules).map(([path, url]) => {
          const id = path
            .split('/')
            .pop()
            .replace(/\.[^/.]+$/, '');
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
        const rawUrl = imageId.replace(/^wadouri:/, ''); // Eliminamos el prefijo 'wadouri:'
        console.log('URL sin wadouri:', rawUrl); // Verificamos la URL sin el prefijo

        const url = new URL(rawUrl, window.location.origin); // Generamos la URL completa
        url.searchParams.set('_', Date.now()); // Añadimos el parámetro para evitar caché
        const fetchUrl = url.href;

        console.log('URL final con parámetro de timestamp:', fetchUrl); // Verificamos la URL final

        // 1) Obtener ArrayBuffer desde la URL
        const res = await fetch(fetchUrl);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: No se pudo cargar el archivo DICOM`);
        }

        let buffer = await res.arrayBuffer();
        console.log('Buffer cargado correctamente:', buffer);

        // 2) Verificar si tiene encabezado "DICM", si no, aplicar makePart10() con dcmjs
        const magic = String.fromCharCode(...new Uint8Array(buffer, 128, 4));
        console.log('Encabezado DICM:', magic);

        if (magic !== 'DICM') {
          console.log('No tiene DICM, aplicando makePart10');
          buffer = await this.makePart10(buffer);
        }

        // 3) Crear una imagen usando cornerstone y devolverla
        const blob = new Blob([buffer], { type: 'application/dicom' });
        const fileId = wado.wadouri.fileManager.add(blob);
        const image = await cs.loadImage(fileId);

        // Verificamos si la imagen fue cargada correctamente
        if (!image || !image.width || !image.height) {
          console.error('La imagen no tiene propiedades de ancho y alto válidas');
          throw new Error('La imagen DICOM no tiene las propiedades necesarias');
        }

        console.log('Imagen cargada:', image);

        // Extraer y almacenar los metadatos del DICOM
        const metadata = dicomParser.parseDicom(new Uint8Array(buffer)); // Usamos dicom-parser para obtener metadatos
        this.setMetadata(fileId, metadata); // Guardamos los metadatos en el archivo

        return image; // Regresa la imagen cargada que puede ser dibujada en el canvas
      } catch (err) {
        this.error = `Error al procesar DICOM: ${err.message}`;
        console.error(this.error);
        return null; // Retornamos null si ocurre un error
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
