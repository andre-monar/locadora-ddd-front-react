import { api } from "./api";

// GET    /api/Carro
export const listarCarros = () => api.get("/Carro");

// GET    /api/Carro/disponiveis
export const listarCarrosDisponiveis = () => api.get("/Carro/disponiveis");

// GET    /api/Carro/:id
export const buscarCarro = (id) => api.get(`/Carro/${id}`);

// POST   /api/Carro
export const criarCarro = (carro) => api.post("/Carro", carro);

// PUT    /api/Carro/:id
export const atualizarCarro = (id, carro) => api.put(`/Carro/${id}`, carro);

// DELETE /api/Carro/:id
export const excluirCarro = (id) => api.delete(`/Carro/${id}`);