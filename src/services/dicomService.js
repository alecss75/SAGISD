// src/services/dicomService.js

console.log('✅ Iniciando dicomService.js');

// 1) Importar todos los DICOM (.dcm) desde src/assets/dicoms/DICOMOBJ
const dicomModules = import.meta.glob('../assets/dicoms/DICOMOBJ/*.dcm', {
  query: 'url',
  eager: true,
});

// console.log('📦 dicomModules importados:', dicomModules);

// Transformar el objeto a un array de { name, url }
const instanceFiles = Object.entries(dicomModules).map(([filePath, url]) => {
  // console.log(`📂 Procesando archivo: ${filePath}`);
  const fileName = filePath.split('/').pop();
  const name = fileName.replace(/\.[^/.]+$/, '');
  const result = { name, url };
  // console.log('📄 Archivo procesado:', result);
  return result;
});

// Para comprobar que no está vacío
// console.log('📋 Dicom instances:', instanceFiles);

// Devuelve los nombres de los archivos sin extensión
export function getInstanceIds() {
  const ids = instanceFiles.map(f => f.name);
  // console.log('🔍 getInstanceIds:', ids);
  return ids;
}

// Devuelve la URL del archivo con el prefijo 'wadouri:'
export function getImageId(name) {
  const baseURL = import.meta.env.BASE_URL; // normalmente "/"
  const url = `${baseURL}dicoms/DICOMOBJ/${name}.dcm`;
  const ts = Date.now(); // anti‐cache
  return `wadouri:${url}?t=${ts}`;
}

// Importa un JSON con metadata pre-generada
import metadataMapping from '../assets/metadata.json';

// console.log('📑 Metadata JSON cargado:', metadataMapping);

// Devuelve los metadatos del archivo si existen
export function getMetadata(name) {
  const metadata = metadataMapping.filter(mtdt => mtdt.id == name);
  console.log(`📊 getMetadata("${name}") →`, metadata);
  return metadata;
}
