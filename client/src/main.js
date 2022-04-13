import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AntD from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/rsa.html.js'

createApp(App).use(AntD).use(store).use(router).mount('#app');
