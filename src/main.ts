import { createApp } from 'vue';
import App from './App.vue';
import usePlugins from '@/plugins';

if (process.env.NODE_ENV !== 'development') {
  window.console.log = () => {};
}

setTimeout(() => {
  const app = createApp(App);
  app.use(usePlugins).mount('#app');
}, 500);
