import authService from "@/plugins/auth0";

export const authGuard = (to, from, next) => {
  if (to.path === "/about") {
    return authService.handleAuthentication();
  }
  if (authService.isAuthenticated) {
    return next();
  }
};
