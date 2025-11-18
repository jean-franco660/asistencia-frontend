import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api/v1/web' });

async function testWebAPI() {
  try {
    // Login
    const login = await api.post('/login', { email: 'admin@example.com', password: '202118088' });
    const token = login.data.token;

    // Listar usuarios web
    const usuarios = await api.get('/usuarios-web', { headers: { Authorization: `Bearer ${token}` } });

    console.log('✅ Usuarios web:', usuarios.data);
  } catch (err) {
    console.error('❌ Error al conectar con la API', err.response?.status, err.response?.data);
  }
}

testWebAPI();
