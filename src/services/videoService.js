const fs = require('fs');
const path = require('path');
const dicomParser = require('dicom-parser');
const { createCanvas, ImageData } = require('canvas');
const ffmpeg = require('fluent-ffmpeg');

const TEMP_DIR = './temp_frames';

// Leer un archivo DICOM y extraer pixel data
function leerDicom(rutaArchivo) {
  try {
    const contenido = fs.readFileSync(rutaArchivo);
    const dataSet = dicomParser.parseDicom(contenido);
    const pixelDataElement = dataSet.elements.x7fe00010;
    if (!pixelDataElement) throw new Error("No contiene pixel data");
    const pixelData = new Uint8ClampedArray(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
    return pixelData;
  } catch (error) {
    console.error('❌ Error al leer DICOM:', rutaArchivo, error);
    return null;
  }
}

// Dibuja el pixel data en un canvas y guarda como PNG
function guardarImagen(canvas, pixelData, frameNumber) {
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(pixelData, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
  const buffer = canvas.toBuffer('image/png');
  const outPath = path.join(TEMP_DIR, `frame_${String(frameNumber).padStart(3, '0')}.png`);
  fs.writeFileSync(outPath, buffer);
  return outPath;
}

// Convierte una serie de DICOM a video
async function convertirDicomAVideo(rutasDicom, salidaVideo = 'output.mp4', width = 512, height = 512, fps = 15) {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

  const canvas = createCanvas(width, height);
  let frame = 0;

  for (const ruta of rutasDicom) {
    const pixelData = leerDicom(ruta);
    if (pixelData) {
      guardarImagen(canvas, pixelData, frame);
      frame++;
    }
  }

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(path.join(TEMP_DIR, 'frame_%03d.png'))
      .inputFPS(fps)
      .outputOptions('-pix_fmt yuv420p')
      .output(salidaVideo)
      .on('end', () => {
        console.log('✅ Video generado:', salidaVideo);
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        resolve(salidaVideo);
      })
      .on('error', (err) => {
        console.error('❌ Error con ffmpeg:', err);
        reject(err);
      })
      .run();
  });
}

module.exports = {
  convertirDicomAVideo
};
