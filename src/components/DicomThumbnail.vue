<template>
  <div ref="canvas" class="thumb-canvas" @click="$emit('select')"></div>
</template>

<script>
import dicomParser from 'dicom-parser';
import dcmjs from 'dcmjs';

export default {
  name: 'DicomThumbnail',
  props: {
    imageId: { type: String, required: true },
  },

  mounted() {
    this.$nextTick(async () => {
      if (this.imageId.includes('00000202')) {
        console.log('🎯 ID objetivo detectado:', this.imageId);
      }

      const cs = this.$cornerstone;
      const wado = this.$cornerstoneWADO;
      const el = this.$refs.canvas;
      cs.enable(el);

      try {
        const rawUrl = this.imageId.replace(/^wadouri:/, '');
        const url = new URL(rawUrl, window.location.origin);
        url.searchParams.set('_', Date.now());
        const fetchUrl = url.href;
        console.log('[DicomThumbnail] fetchURL →', fetchUrl);

        // 1) Obtener ArrayBuffer desde la URL
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let buffer = await res.arrayBuffer();

        // 2) Verificar si tiene encabezado "DICM", si no, aplicar makePart10() con dcmjs
        const magic = String.fromCharCode(...new Uint8Array(buffer, 128, 4));
        if (magic !== 'DICM') {
          console.log('⚠️ No hay encabezado DICM, generando Part 10...');
          buffer = await this.makePart10(buffer);
          console.log('✅ Archivo convertido a DICOM Part 10');
        }

        // 3) Mostrar la imagen en el visor
        const blob = new Blob([buffer], { type: 'application/dicom' });
        const fileId = wado.wadouri.fileManager.add(blob);
        const image = await cs.loadImage(fileId);
        cs.displayImage(el, image);
      } catch (err) {
        console.error('❌ Error al procesar o mostrar la imagen:', err);
      }
    });
  },

  methods: {
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
};
</script>

<style scoped>
.thumb-canvas {
  width: 100px;
  height: 100px;
  background: black;
  cursor: pointer;
  margin: 4px;
}
</style>
