<template>
  <div class="d-flex" id="wrapper">
    <div class="bg-brown-dark border-right d-flex flex-column" id="sidebar-wrapper">
      <div class="sidebar-heading text-center">
        <div class="logo-circle" style="background-color: #c0da63ff;">
          <i class="fas fa-cow text-white"></i>
        </div>
        <h2 class="text-white mt-3 mb-0">Sergen</h2>
      </div>
      
      <div class="list-group list-group-flush flex-grow-1">
        <router-link :to="{ name: 'dashboard' }"
          class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2">
          <i class="fas fa-chart-line me-3"></i>Panel
        </router-link>
        <router-link :to="{ name: 'account-management' }"
          class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2">
          <i class="fas fa-user-circle me-3"></i>Mi Cuenta
        </router-link>
        <router-link :to="{ name: 'property-management' }"
          class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2 ">
          <i class="fas fa-tractor me-3"></i>Propiedad Actual
        </router-link>
        <router-link :to="{ name: 'insemination-management' }"
          class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2 ">
          <i class="fas fa-clipboard-list me-3"></i>Etapas
        </router-link>
        <router-link :to="{ name: 'insemination-report' }"
          class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2 ">
          <i class="fas fa-file-alt me-3"></i>Reportes
        </router-link>
      </div>

      <div class="mt-auto p-3">
        <button @click="handleLogout"
          class="list-group-item list-group-item-action bg-transparent text-white fw-bold border-0 w-100 text-start">
          <i class="fas fa-sign-out-alt me-3"></i>Cerrar Sesión
        </button>
      </div>
    </div>

    <div id="page-content-wrapper" class="bg-light-cream">
      <button class="btn btn-success d-lg-none menu-toggle-btn" id="menu-toggle">
        <i class="fas fa-bars"></i>
      </button>
      <div class="container-fluid p-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionPropertyStore } from '@/store/SessionProperty';

const router = useRouter();
const sessionStore = useSessionPropertyStore();

const handleLogout = async () => { 
  try {
    await sessionStore.logout();
        router.push({ name: 'login' });
  } catch (error) {
    // Aunque falle la red, el store se limpia en el 'finally' del store, 
    // así que igual redirigimos por seguridad.
    console.error('Error during logout:', error);
    //router.push({ name: 'login' });
  }
};

onMounted(() => {
  const toggleButton = document.getElementById('menu-toggle');
  const wrapper = document.getElementById('wrapper');

  if (toggleButton && wrapper) {
    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      wrapper.classList.toggle('toggled');
      toggleButton.style.display = 'none';
    });

    const sidebar = document.getElementById('sidebar-wrapper');
    sidebar.addEventListener('transitionend', () => {
      if (!wrapper.classList.contains('toggled')) {
        toggleButton.style.display = 'block';
      }
    });
  }
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app,
#wrapper {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Colores de ganadería */
.bg-brown-dark {
  background-color: #5C4A38;
}

.bg-terracotta {
  background-color: #A65A42;
}

.bg-light-cream {
  background-color: #F8F4E6;
}

.text-white {
  color: #fff;
}

#wrapper {
  display: flex;
}

#sidebar-wrapper {
  width: 17rem;
  /* Ancho fijo del sidebar */
  min-height: 100vh;
  transition: transform .25s ease-out;
  transform: translateX(-17rem);
}

#wrapper.toggled #sidebar-wrapper {
  transform: translateX(0);
}

#page-content-wrapper {
  flex-grow: 1;
  width: 100%;
}

.sidebar-heading {
  padding: 1.2rem 1.25rem;
  font-size: 1.2rem;
}

.list-group-item-action {
  transition: all .2s ease-in-out;
}

/* Cambia el color del sidebar al color usado en SelectProperty */
#sidebar-wrapper {
  background-color: #4F7B3A;
  /* Verde naturaleza usado en las tarjetas de SelectProperty */
}

.list-group-item-action:hover {
  background-color: rgba(255, 255, 255, 0.35) !important;
  transform: scale(1.0);
}

.logo-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto;
}

.fa-cow,
.fa-tractor,
.fa-chart-line,
.fa-clipboard-list,
.fa-file-alt,
.fa-user-circle {
  font-size: 2rem;
}

/* Botón de menú para dispositivos móviles */
.menu-toggle-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}

@media (min-width: 768px) {
  #wrapper #sidebar-wrapper {
    transform: translateX(0);
  }

  .menu-toggle-btn {
    display: none !important;
  }
}

.list-group-item.router-link-exact-active {
  background-color: #76A868 !important;
  color: #fff !important;
  font-weight: bold;
}

#page-content-wrapper {
  flex-grow: 1;
  width: 100%;
  height: 100vh;
  /* Ocupa todo el alto */
  overflow: hidden;
  /* BLOQUEA EL SCROLL EXTERIOR */
  display: flex;
  flex-direction: column;
}

.container-fluid.p-4 {
  flex-grow: 1;
  overflow: hidden;
  /* Sigue bloqueando el scroll hacia afuera */
  display: flex;
  flex-direction: column;
}

.border-0 {
  border: none !important;
}
button.list-group-item-action {
  outline: none;
}

</style>
