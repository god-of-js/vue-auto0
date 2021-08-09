import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

// Auth0 configuration
import { Auth0Plugin } from "@/plugins/auth0.js";
Vue.use(Auth0Plugin, {
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
  audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  },
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
