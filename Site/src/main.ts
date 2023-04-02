import { createApp } from 'vue';

import App from './App.vue';

import router from './router';

import '@/assets/css/theme.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import store from './store';

const app = createApp(App);

app.use(store);
app.use(router);

app.mount('#app');