// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify stuff…
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Cornerstone + WADO + Parser + Hammer
import cornerstone from 'cornerstone-core'
import * as cornerstoneTools from 'cornerstone-tools'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import Hammer from 'hammerjs'

// wire up the externals
cornerstoneWADOImageLoader.external.cornerstone   = cornerstone
cornerstoneWADOImageLoader.external.dicomParser   = dicomParser
cornerstoneTools.external.cornerstone             = cornerstone
cornerstoneTools.external.Hammer                  = Hammer

cornerstoneWADOImageLoader.configure({
  useWebWorkers: true,
  decodeConfig: {
    convertFloatPixelDataToInt: false,
  },
});

var config = {
  maxWebWorkers: navigator.hardwareConcurrency || 1,
  startWebWorkersOnDemand: false,
  taskConfiguration: {
    decodeTask: {
      initializeCodecsOnStartup: true,
      strict: false,
    },
  },
};

cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

cornerstoneTools.init()

import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App)

app.config.globalProperties.$cornerstone      = cornerstone
app.config.globalProperties.$cornerstoneTools = cornerstoneTools
app.config.globalProperties.$cornerstoneWADO  = cornerstoneWADOImageLoader

app
  .use(router)
  .use(pinia)
  .use(createVuetify({ components, directives }))
  .mount('#app')
