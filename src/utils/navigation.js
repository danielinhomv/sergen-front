import { useRouter } from 'vue-router';

export function useNavigation() {
  const router = useRouter();
  
  const goTo = (route) => {
    if (typeof route === 'string') {
      router.push({ name: route });
    } else {
      router.push(route);
    }
  };

  /**
   * Navegar reemplazando la entrada actual (no se puede volver atrás)
   * @param {string|object} route - Nombre de la ruta o un objeto de ruta
   */
  const replaceTo = (route) => {
    if (typeof route === 'string') {
      router.replace({ name: route });
    } else {
      router.replace(route);
    }
  };

  /**
   * Volver atrás si hay historial
   */
  const goBack = () => {
    router.back();
  };

  return {
    goTo,
    replaceTo,
    goBack
  };
}
