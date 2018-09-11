import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify from 'vuetify';
import { NEMLibrary, NetworkTypes } from 'nem-library';

Vue.config.productionTip = false;
Vue.use(Vuetify);
NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
