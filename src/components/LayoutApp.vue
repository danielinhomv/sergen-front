<template>
  <div class="d-flex" id="wrapper">

    <!-- Sidebar (Menú Lateral) -->
    <div class="bg-brown-dark border-right d-flex flex-column" id="sidebar-wrapper">
      <div class="sidebar-heading text-center">
        <div class="logo-circle" style="background-color: #c0da63ff;">
          <i class="fas fa-cow text-white"></i>
        </div>
        <h2 class="text-white mt-3 mb-0">Sergen</h2>
      </div>
      <div class="list-group list-group-flush flex-grow-1">
        <a href="#" class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2">
          <i class="fas fa-user-circle me-3"></i>Mi Cuenta
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2">
          <i class="fas fa-chart-line me-3"></i>Dashboard
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2 ">
          <i class="fas fa-tractor me-3"></i>Propiedad Actual
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2 ">
          <i class="fas fa-clipboard-list me-3"></i>Etapas
        </a>
        <a href="#" class="list-group-item list-group-item-action bg-transparent text-white fw-bold p-3 mb-2 ">
          <i class="fas fa-file-alt me-3"></i>Reportes
        </a>
       
      </div>
      <!-- Separador y opción de Cerrar Sesión -->
      <div class="mt-auto p-3">
        <a href="#" class="list-group-item list-group-item-action bg-transparent text-white fw-bold ">
          <i class="fas fa-sign-out-alt me-3"></i>Cerrar Sesión
        </a>
      </div>
    </div>
    <!-- /#sidebar-wrapper -->

    <!-- Contenido Principal -->
    <div id="page-content-wrapper" class="bg-light-cream">
      <!-- Botón para mostrar el menú en dispositivos móviles (Fijo en la esquina superior izquierda) -->
      <button class="btn btn-success d-lg-none menu-toggle-btn" id="menu-toggle">
        <i class="fas fa-bars"></i>
      </button>

      <div class="container-fluid p-4">
        <slot></slot>
      </div>
    </div>
    <!-- /#page-content-wrapper -->

  </div>
</template>

<script setup>

import { onMounted } from 'vue';



onMounted(() => {

const toggleButton = document.getElementById('menu-toggle');

const wrapper = document.getElementById('wrapper');



if (toggleButton && wrapper) {

toggleButton.addEventListener('click', (e) => {

e.preventDefault();

wrapper.classList.toggle('toggled');

// Oculta el botón al hacer clic en él

toggleButton.style.display = 'none';

});



// Muestra el botón cuando el menú lateral se oculta

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
/* Reset de estilos para eliminar márgenes y paddings por defecto */
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app, #wrapper {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Colores de ganadería */
.bg-brown-dark { background-color: #5C4A38; }
.bg-terracotta { background-color: #A65A42; }
.bg-light-cream { background-color: #F8F4E6; }
.text-white { color: #fff; }

#wrapper {
  display: flex;
}

#sidebar-wrapper {
  width: 17rem; /* Ancho fijo del sidebar */
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
  background-color: #4F7B3A; /* Verde naturaleza usado en las tarjetas de SelectProperty */
}
.list-group-item-action:hover {
  background-color: rgba(255, 255, 255, 0.35) !important;
  transform: scale(1.03);
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

.fa-cow, .fa-tractor, .fa-chart-line, .fa-clipboard-list, .fa-file-alt, .fa-user-circle {
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

</style>
