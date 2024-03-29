import { createApp } from 'vue'

import App from './App.vue'
import {i18n} from "./locales";

import {updateLoop} from "./store/count.ts";

import './style/index.less'

const app = createApp(App)

app.use(i18n)

updateLoop()

app.mount('#app')
