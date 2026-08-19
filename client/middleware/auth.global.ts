import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(to.path);

  if (!authStore.isAuthenticated && !isPublicRoute) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }

  if (authStore.isAuthenticated && isPublicRoute) {
    const redirectPath = (to.query.redirect as string) || '/';
    return navigateTo(redirectPath);
  }
});
