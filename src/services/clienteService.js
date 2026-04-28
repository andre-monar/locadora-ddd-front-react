import { api } from "./api";

// GET    /api/Cliente
export const listarClientes = () => api.get("/Cliente");

// GET    /api/Cliente/:id
export const buscarCliente = (id) => api.get(`/Cliente/${id}`);

// POST   /api/Cliente
export const criarCliente = (cliente) => api.post("/Cliente", cliente);

// PUT    /api/Cliente/:id
export const atualizarCliente = (id, cliente) => api.put(`/Cliente/${id}`, cliente);

// DELETE /api/Cliente/:id
export const excluirCliente = (id) => api.delete(`/Cliente/${id}`);