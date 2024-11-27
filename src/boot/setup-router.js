import { useAuthStore } from 'src/stores/authStore'

export default async function ({ router }) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    // Si la ruta requiere que el usuario no esté autenticado
    if (to.meta?.requiresNoAuth && authStore.isAuthenticated) {
      return next({ name: 'inventory-dashboard' });
    }

    // Si la ruta requiere autenticación y el usuario no está autenticado
    if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
      return next({ name: 'login-screen' });
    }

    // Si ninguna de las condiciones anteriores se cumple, permite la navegación
    next();
  })
}