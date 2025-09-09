import axios from 'axios';
import User from '.../model/User'; // Asegúrate de que la ruta sea correcta
import Api from '.../environment/Api'; // Ajusta la ruta si es necesario

const API_URL = Api.API_URL;

class AuthService {
    async login(name, password) {
        const response = await axios.post(`${API_URL}/login`, { name, password });
        const userData = response.data.user;
        const token = response.data.token;
        const user = new User(userData.id, userData.name, userData.email, token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        const userObj = JSON.parse(userStr);
        return new User(userObj.id, userObj.name, userObj.email, userObj.token);
    }
}

export default new AuthService();