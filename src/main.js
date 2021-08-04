import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { Auth0Plugin } from "./plugins/auth0";

Vue.config.productionTip = false;

Vue.use(Auth0Plugin, {
  domain: process.env.VUE_APP_DOMAIN,
  clientId: process.env.VUE_APP_CLIENT_ID,
  responseType: "token id_token",
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
