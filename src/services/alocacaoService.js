import { api } from "./api";

// GET    /api/Alocacao
export const listarAlocacoes = () => api.get("/Alocacao");

// GET    /api/Alocacao/:id
export const buscarAlocacao = (id) => api.get(`/Alocacao/${id}`);

// POST   /api/Alocacao
export const criarAlocacao = (alocacao) => api.post("/Alocacao", alocacao);

// PUT    /api/Alocacao/:id
export const atualizarAlocacao = (id, alocacao) => api.put(`/Alocacao/${id}`, alocacao);

// DELETE /api/Alocacao/:id
export const excluirAlocacao = (id) => api.delete(`/Alocacao/${id}`);