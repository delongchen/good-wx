import { createApp } from 'vue'

import App from './App.vue'
import {i18n} from "./locales";
import router from "./router";

import './style/index.less'

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')
