import axios from 'axios';
const BASE_URL = 'http://localhost:8080';


const request = async (url, method = 'GET', data = null, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options = { method, url: `${BASE_URL}${url}`, headers };
    if (data) options.data = data;
    
    const response = await axios(options);
    return response.data;
};


export const api = {
  auth: {
    register: (data) => request("/auth/register", "POST", data),
    login: (data) => request("/auth/login", "POST", data)
  },
  torneo: {
    create: (data, token) => request("/torneo", "POST", data, token),
    getAll: (token) => request("/torneo", "GET", null, token),
    getAllActivos: () => request("/torneo/activos"),
    getAllFinalizados: () => request("/torneo/finalizados"),
    getById: (id) => request("/torneo/" + id),
    inscribirse: (torneoId, usuarioId, token) =>
      request(`/torneo/inscripcion/${torneoId}`, "POST", { usuarioId }, token),
    changeStatus: (torneoId, data, token) =>
      request(`/torneo/cambiar-estado/${torneoId}`, "PUT", data, token),
    updateTorneo: (torneoId, data, token) =>
      request(`/torneo/${torneoId}`, "PUT", data, token)
  },
  testimonio: {
    create: (data, token) => request("/testimonio", "POST", data, token),
    getAll: () => request("/testimonio", "GET")
  },
  usuario: {
    getAllUsuarios: (token) => request("/usuario", "GET", null, token),
    getUserById: (usuarioId) => request(`/usuario/${usuarioId}`),
    getTorneos: (userId, token) =>
      request(`/usuario/torneos/${userId}`, "GET", null, token),
    getTestimonios: (userId, token) =>
      request(`/usuario/testimonios/${userId}`, "GET", null, token),
    updateProfile: (userId, data, token) =>
      request(`/usuario/${userId}`, "PUT", data, token)
  },
  contacts: {
    create: (data) => request("/contacts", "POST", data),
    getAll: () => request("/contacts", "GET")
  }
};
