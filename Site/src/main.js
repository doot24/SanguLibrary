import { createApp } from 'vue'

import App from './App.vue'

import router from './router'

import '@/assets/css/theme.css';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'

import store from './store'

createApp(App).use(store).use(router).mount('#app')
