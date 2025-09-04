<template>
    <div class="property-card-container">
        <!-- Tarjeta de Propiedad (Repetir para cada propiedad) -->
          <div class="add-property-card">
            <button class="btn btn-outline-secondary new-property-btn" @click="createNewProperty">
                <i class="fas fa-plus-circle me-2"></i>Añadir Nueva Propiedad
            </button>
        </div>
        <div class="property-card">
            <div class="property-info">
                <h2 class="property-name">
                    {{ property.name }}
                    <span class="ms-2">
                        <!-- Icono de ramitas (referencia ganadera, color que combine con verde/blanco) -->
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Rama principal -->
                            <path d="M12 20C12 14 7 13 7 7" stroke="#388E3C" stroke-width="2" stroke-linecap="round"/>
                            <!-- Rama secundaria -->
                            <path d="M12 20C12 14 17 13 17 7" stroke="#388E3C" stroke-width="2" stroke-linecap="round"/>
                            <!-- Hojas -->
                            <ellipse cx="7" cy="7" rx="1.2" ry="2" fill="#C8E6C9"/>
                            <ellipse cx="17" cy="7" rx="1.2" ry="2" fill="#C8E6C9"/>
                            <ellipse cx="9" cy="10" rx="1" ry="1.6" fill="#A5D6A7"/>
                            <ellipse cx="15" cy="10" rx="1" ry="1.6" fill="#A5D6A7"/>
                        </svg>
                    </span>
                </h2>
                <p><strong>Lugar:</strong> {{ property.location }}</p>
                <p><strong>Dueño:</strong> {{ property.owner }}</p>
                <p><strong>Teléfono:</strong> {{ property.phone }}</p>
            </div>
            <button class="start-btn" @click="startWork">
                Iniciar trabajo en esta propiedad
            </button>
        </div>

        <div class="property-card">
            <div class="property-info">
                <h2 class="property-name">
                    {{ property.name }}
                    <span class="ms-2">
                        <!-- Icono de ramitas (referencia ganadera, color que combine con verde/blanco) -->
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Rama principal -->
                            <path d="M12 20C12 14 7 13 7 7" stroke="#388E3C" stroke-width="2" stroke-linecap="round"/>
                            <!-- Rama secundaria -->
                            <path d="M12 20C12 14 17 13 17 7" stroke="#388E3C" stroke-width="2" stroke-linecap="round"/>
                            <!-- Hojas -->
                            <ellipse cx="7" cy="7" rx="1.2" ry="2" fill="#C8E6C9"/>
                            <ellipse cx="17" cy="7" rx="1.2" ry="2" fill="#C8E6C9"/>
                            <ellipse cx="9" cy="10" rx="1" ry="1.6" fill="#A5D6A7"/>
                            <ellipse cx="15" cy="10" rx="1" ry="1.6" fill="#A5D6A7"/>
                        </svg>
                    </span>
                </h2>
                <p><strong>Lugar:</strong> {{ property.location }}</p>
                <p><strong>Dueño:</strong> {{ property.owner }}</p>
                <p><strong>Teléfono:</strong> {{ property.phone }}</p>
            </div>
            <button class="start-btn" @click="startWork">
                Iniciar trabajo en esta propiedad
            </button>
        </div>       
        <!-- Tarjeta para crear una nueva propiedad -->
      
    </div>
</template>

<script>
export default {
    name: "SelectProperty",
    props: {
        property: {
            type: Object,
            required: true,
            default: () => ({
                name: "Propiedad Ganadera Ejemplo",
                location: "Ubicación Ejemplo",
                owner: "Dueño Ejemplo",
                phone: "123456789"
            })
        }
    },
    methods: {
        startWork() {
            // Aquí puedes emitir un evento o navegar a otra vista
            this.$emit('start-work', this.property);
        },
        createNewProperty() {
            this.$emit('create-new-property');
        }
    }
};
</script>

<style scoped>
.property-card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    padding: 2rem;
}
.property-card, .add-property-card {
    min-width: 300px;
    width: 100%;
    max-width: 380px;
    padding: 2rem;
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: box-shadow 0.2s;
}
.property-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.property-info {
    width: 100%;
    margin-bottom: 1.5rem;
}
.property-name {
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
    color: #2d5c2d;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.start-btn {
    padding: 0.8rem 1.6rem;
    background: #2d5c2d;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
}
.start-btn:hover {
    background: #1e3e1e;
}
.add-property-card {
    border: 2px dashed #ccc;
    background: #f9f9f9;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
}
.add-property-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    border-color: #2d5c2d;
}
.new-property-btn {
    background: transparent;
    color: #2d5c2d;
    border: none;
    font-size: 1.1rem;
    padding: 1rem 2rem;
    width: auto;
}
.new-property-btn:hover {
    color: #1e3e1e;
}
@media (max-width: 600px) {
    .property-card, .add-property-card {
        padding: 1rem;
        max-width: 95vw;
    }
    .property-name {
        font-size: 1.2rem;
    }
    .start-btn {
        font-size: 0.9rem;
        padding: 0.6rem 1.2rem;
    }
}
</style>
