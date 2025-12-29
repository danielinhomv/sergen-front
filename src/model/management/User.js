// src/model/auth/User.js

export class User {
    constructor({ id = null, name = '', created_at = null, updated_at = null }) {
        this.id = id;
        this.name = name;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * Mapea la respuesta de Laravel a la clase de Vue
     */
    static fromJson(json) {
        if (!json) return null;
        return new User({
            id: json.id,
            name: json.name,
            created_at: json.created_at,
            updated_at: json.updated_at
        });
    }

    /**
     * Prepara los datos para ser enviados al servidor si fuera necesario
     */
    toJson() {
        return {
            id: this.id,
            name: this.name
            // Generalmente no enviamos created_at ni updated_at al backend
        };
    }

    /**
     * Helper para obtener una versión amigable de la fecha de registro
     */
    get formattedCreatedAt() {
        if (!this.created_at) return 'N/A';
        return new Date(this.created_at).toLocaleDateString();
    }
}