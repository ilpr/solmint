import { createApp } from 'vue'
import App from './App.vue'
import 'solana-wallets-vue/styles.css'
import './main.css'
import routes from './routes'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

createApp(App).use(router).mount('#app');
