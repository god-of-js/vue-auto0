import { getInstance } from "@/plugins/auth0";

export const authGuard = (to, from, next) => {
  const authService = getInstance();

  const fn = async () => {
    if (authService.isAuthenticated) {
      return next();
    }

    await authService.loginWithRedirect({
      appState: { targetUrl: to.fullPath },
    });
  };

  if (!authService.loading) {
    return fn();
  }

  authService.$watch("loading", (loading) => {
    if (loading === false) {
      return fn();
    }
  });
};
