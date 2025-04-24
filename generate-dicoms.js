import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recrear __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
const dicomFolder = path.join(__dirname, 'public/dicoms/DICOMOBJ');
const outputFile = path.join(__dirname, 'public/dicoms/dicoms.json');

// Leer el directorio
fs.readdir(dicomFolder, (err, files) => {
  if (err) {
    console.error('❌ Error al leer los archivos DICOM:', err);
    return;
  }

  const dicomFiles = files.filter(file => file.endsWith('.dcm'));

  fs.writeFileSync(outputFile, JSON.stringify({ files: dicomFiles }, null, 2));
  console.log('✅ Archivo dicoms.json generado con éxito');
});
