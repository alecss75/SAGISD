<template>
  <div>
    <AppBar />
    <v-card outlined height="90vh">
      <v-row>
        <!-- Visor 2D -->
        <v-col md="6">
          <VisorPrincipal :imageId="currentImageId" />
        </v-col>

        <!-- Galería y Modelo 3D -->
        <v-col md="4">
          <GaleriaMiniatura :instanceIds="instanceIds" @select="onSelect" />
        </v-col>

        <!-- Barra de herramientas -->
        <v-col md="2">
          <v-card class="pa-2">
            <!-- Botón para generar video -->
            <v-btn @click="generarVideo" color="primary" class="mt-3">Descargar</v-btn>
            <!-- Botón para exportar -->
            <v-btn @click="generarVideo" color="primary" class="mt-3">Exportar </v-btn>
            <!-- Botón para compartir  -->
            <v-btn @click="generarVideo" color="primary" class="mt-3">Compartir</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Modal para mostrar el video generado -->
    <v-dialog v-model="videoDialog" max-width="90%">
      <v-card>
        <v-card-title class="text-h6">Video Generado</v-card-title>
        <v-card-text>
          <video ref="videoPlayer" controls width="100%">
            <source :src="videoUrl" type="video/mp4" />
            Tu navegador no soporta este formato de video.
          </video>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="videoDialog = false" color="primary">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import AppBar from '@/components/AppBar.vue';
import VisorPrincipal from '@/components/VisorPrincipal.vue';
import GaleriaMiniatura from '@/components/GaleriaMiniatura.vue';
import { getInstanceIds, getImageId } from '@/services/dicomService';
import { convertirDicomAVideo } from '@/services/videoService'; // Importa el servicio de video

export default {
  name: 'DicomViewer',
  components: {
    AppBar,
    VisorPrincipal,
    GaleriaMiniatura,
  },
  data() {
    return {
      instanceIds: getInstanceIds(),
      currentImageId: null,
      tools: [
        {
          icon: 'mdi-download',
          label: 'Descargar actual',
          action: () => console.log('Descargando...'),
        },
        {
          icon: 'mdi-download',
          label: 'Exportar video',
          action: () => {
            generarVideo();  // Esta acción se mantiene, pero el método es ahora actualizado
          },
        },
        // Otras herramientas
      ],
      videoDialog: false,
      videoUrl: '',  // Almacenará la URL del video generado
    };
  },
  methods: {
    onSelect(id) {
      this.currentImageId = getImageId(id);
    },

    // Método para generar el video
    async generarVideo() {
      try {
        const rutasDicom = this.instanceIds.map(id => getImageId(id)); // Rutas de las imágenes DICOM
        this.videoUrl = await convertirDicomAVideo(rutasDicom); // Llamada al servicio para generar el video
        console.log('Video generado:', this.videoUrl);
        this.videoDialog = true; // Mostrar el diálogo con el video
      } catch (error) {
        console.error('Error generando el video:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Estilos para el contenedor del video y la galería */
</style>
