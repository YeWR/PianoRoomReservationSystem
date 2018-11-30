import Vue from "vue";
import axios from "./https"
import App from "./Base.vue";
import router from "./router";
import store from "./store";
import VueMaterial from 'vue-material';
import Notifications from 'vue-notification'

Vue.config.productionTip = false;

Vue.use(VueMaterial);
Vue.use(Notifications);
Vue.prototype.axios = axios;

new Vue({
    axios,
    router,
    store,
    render: h => h(App)
}).$mount("#login");