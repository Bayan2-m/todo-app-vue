
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import AOS from "aos"
import "aos/dist/aos.css"

const app = createApp(App)

app.use(Toast)

app.mount('#app')

