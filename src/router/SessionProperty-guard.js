import { useSessionPropertyStore } from '@/store/SessionProperty.js';

export function createSessionPropertyGuard(router) {

    router.beforeEach((to, from, next) => {

        const sessionPropertyStore = useSessionPropertyStore();

        if (to.name === 'select-property' && !sessionPropertyStore.isWorked) {
             return next({ 
                name: 'select-property', 
                replace: true 
            }); 
        }
       if (to.name === 'select-property' && sessionPropertyStore.isWorked) {
            return next({ 
                name: 'dashboard', 
                replace: true 
            }); 
        }
        next();
    })
}