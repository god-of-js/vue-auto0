import router from "@/router";
import auth0 from "auth0-js";
import append from "ramda/src/append";

class AuthService {
  constructor() {
    // HOSTED
    this.login = this.login.bind(this);
    this.setSession = this.setSession.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.authenticatedHandlers = [];
    this.beforeLogoutHandlers = [];

    // const { clientId, webappUrl } = this._getAuth0Props();

    this.auth0 = new auth0.WebAuth({
      clientID: process.env.VUE_APP_CLIENT_ID,
      domain: process.env.VUE_APP_DOMAIN,
      responseType: "token id_token",
      redirectUri: window.location.origin,
      audience: "https://dev-amio.eu.auth0.com/api/v2/",
    });
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log(authResult);
        this.setSession(authResult);
        this.authenticatedHandlers.forEach((handler) => handler());
        return;
      }

      if (err) {
        // TODO log some cases to slack error_prod
        this.login(err.errorDescription);
        return;
      }

      this.login("Something went wrong. Please report this at support@amio.io");
    });
  }

  login(errorMessage = null) {
    if (!errorMessage) {
      this.auth0.authorize();
      return;
    }

    this.auth0.authorize({
      authParamsMap: { errorMessage },
    });
  }

  signUp(email) {
    this.auth0.authorize({
      login_hint: email || "",
    });
  }

  setSession(authResult) {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  logout() {
    this.beforeLogoutHandlers.forEach((handler) => handler());

    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    router.replace("/login");
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }

  getExpirationTime() {
    return localStorage.getItem("expires_at");
  }

  addAuthenticatedHandler(handler) {
    this.authenticatedHandlers = append(handler, this.authenticatedHandlers);
    return this;
  }

  addBeforeLogoutHandler(handler) {
    this.beforeLogoutHandlers = append(handler, this.beforeLogoutHandlers);
  }

  _getAuth0Props() {
    return {
      clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
      webappUrl: process.env.VUE_APP_SERVER_URL,
      connectionName: process.env.VUE_APP_AUTH0_CONNECTION_NAME,
    };
  }
}

export default new AuthService();
