import { api } from "./api";

// GET    /api/CategoriaCarro
export const listarCategorias = () => api.get("/CategoriaCarro");

// GET    /api/CategoriaCarro/:id
export const buscarCategoria = (id) => api.get(`/CategoriaCarro/${id}`);

// POST   /api/CategoriaCarro
export const criarCategoria = (categoria) => api.post("/CategoriaCarro", categoria);

// PUT    /api/CategoriaCarro/:id
export const atualizarCategoria = (id, categoria) => api.put(`/CategoriaCarro/${id}`, categoria);

// DELETE /api/CategoriaCarro/:id
export const excluirCategoria = (id) => api.delete(`/CategoriaCarro/${id}`);