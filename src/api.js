const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.erro ?? data?.message ?? "Erro na requisição");
  }

  // A API retorna { sucesso: true, dados: [...] }
  return data.dados ?? data;
}

export const api = {
  get:    (path)         => request(path),
  post:   (path, body)   => request(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: "DELETE" }),
};