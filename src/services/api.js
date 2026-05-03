const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  console.log("Requisição:", options.method || "GET", `${BASE_URL}${path}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // DELETE pode retornar corpo vazio
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null;
  }

  const body = await res.json().catch(() => ({}));
  console.log("Resposta:", res.status, body);

  if (!res.ok) {
    const err = new Error(body?.mensagem || body?.title || "Erro na requisição");
    // Se vier array de erros, anexa para o FormModal
    if (Array.isArray(body?.erros)) {
      const msg = body.erros.map(e => `${e.campo}: ${e.mensagem}`).join('; ');
      console.log("Erros do backend:", body.erros);
  console.log("Mensagem montada:", msg);
      throw { message: msg, erros: body.erros };
    }
    throw err;
  }

  return body;
}

export const api = {
  get:    (path)       => request(path),
  post:   (path, body) => request(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    (path, body) => request(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: (path)       => request(path, { method: "DELETE" }),
};