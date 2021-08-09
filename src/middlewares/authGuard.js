import { getInstance } from "@/plugins/auth0";

export const authGuard = async (to, from, next) => {
  //   auth0 integration
  // Checking if the route requires authentication.
  if (to.meta.requiresAuth) {
    // Getting the auth0instance
    const auth0Instance = getInstance();
    const fn = async () => {
      if (auth0Instance.isAuthenticated) {
        return next();
      }
      // initiating the login with redirect. This triggers only when the user has not been authenticated
      await auth0Instance.loginWithRedirect({
        appState: { targetUrl: to.fullPath },
      });
    };

    if (!auth0Instance.loading) {
      return fn();
    }

    auth0Instance.$watch("loading", (loading) => {
      if (loading === false) {
        return fn();
      }
    });
    return next();
  } else {
    next();
  }
};
