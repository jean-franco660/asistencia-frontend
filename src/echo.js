import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Pusher = Pusher;

// Extraemos token del store/localStorage si es necesario
// para autorizar canales privados
const token = localStorage.getItem('auth_token') || ''; 

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: 'http://localhost:8000/api/broadcasting/auth', // Asegurar que sea la ruta correcta o omitir si usa Sanctum de forma relativa
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        }
    }
});
