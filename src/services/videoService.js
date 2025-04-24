import { createCanvas, ImageData } from 'canvas';  // Para crear un canvas donde dibujaremos las imágenes
import dicomParser from 'dicom-parser';  // Para procesar DICOM

// Función para leer un archivo DICOM y extraer los datos de píxeles
function leerDicom(rutaArchivo) {
  try {
    const contenido = rutaArchivo; // El contenido será un ArrayBuffer recibido desde un fetch o similar
    const dataSet = dicomParser.parseDicom(contenido);  // Usamos dicom-parser para analizar el archivo
    const pixelDataElement = dataSet.elements.x7fe00010;  // Obtenemos los datos de píxeles
    if (!pixelDataElement) throw new Error("No contiene pixel data");
    const pixelData = new Uint8ClampedArray(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
    return pixelData;
  } catch (error) {
    console.error('❌ Error al leer DICOM:', error);
    return null;
  }
}

// Dibuja el pixel data en un canvas y devuelve la imagen como ImageData
function guardarImagen(canvas, pixelData, width, height) {
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(pixelData, width, height);
  ctx.putImageData(imageData, 0, 0);
}

// Función para convertir las imágenes DICOM a video sin FFmpeg
async function convertirDicomAVideo(rutasDicom, salidaVideo = 'output.mp4', width = 512, height = 512, fps = 15) {
  const canvas = createCanvas(width, height);  // Creamos el canvas donde dibujaremos las imágenes
  const stream = canvas.captureStream(fps);  // Creamos un stream del canvas con la tasa de frames deseada
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });  // Creamos un grabador de video

  const chunks = [];  // Array donde guardaremos los fragmentos del video

  mediaRecorder.ondataavailable = (event) => {
    chunks.push(event.data);  // Almacena los fragmentos de video
  };

  mediaRecorder.onstop = () => {
    // Al parar la grabación, unimos todos los fragmentos para crear el archivo final
    const blob = new Blob(chunks, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);  // Creamos un URL para reproducir el video
    console.log('Video creado:', videoUrl);
  };

  mediaRecorder.start();  // Comienza a grabar

  // Crear las imágenes (frames) y agregarlas al video
  for (const ruta of rutasDicom) {
    const pixelData = leerDicom(ruta);  // En un frontend, esto vendrá de un ArrayBuffer de un fetch
    if (pixelData) {
      guardarImagen(canvas, pixelData, width, height);  // Dibujamos la imagen en el canvas
      await new Promise(resolve => setTimeout(resolve, 1000 / fps));  // Esperamos entre frames para mantener el fps
    }
  }

  mediaRecorder.stop();  // Detenemos la grabación

  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      resolve(videoUrl);  // Retorna el video generado
    };
  });
}

export { convertirDicomAVideo };  // Exportamos la función para usarla en otros componentes
