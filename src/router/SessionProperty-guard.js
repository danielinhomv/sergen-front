import { useSessionPropertyStore } from '@/store/SessionProperty.js';

export function createSessionPropertyGuard(router) {
    router.beforeEach((to, from, next) => {
        const sessionPropertyStore = useSessionPropertyStore();

        if (!sessionPropertyStore.isAuthenticated) {
            if (to.name !== 'login' && to.meta.requiresAuth !== false) {
                return next({ name: 'login', replace: true });
            }
            return next(); // Si va al login o la ruta es pública, adelante
        }

        // Si intenta ir al Login estando ya logueado, decidir según su trabajo
        if (to.name === 'login') {
            return next({
                name: sessionPropertyStore.isWorked ? 'dashboard' : 'select-property',
                replace: true
            });
        }

        // Si ya está trabajando e intenta volver a selección de propiedad, al Dashboard
        if (to.name === 'select-property' && sessionPropertyStore.isWorked) {
            return next({ name: 'dashboard', replace: true });
        }

        // Si NO está trabajando y la ruta requiere una sesión de trabajo activa
        if (!sessionPropertyStore.isWorked && to.meta.requiresWorkSession) {
            return next({ name: 'select-property', replace: true });
        }

        next();
    });
}