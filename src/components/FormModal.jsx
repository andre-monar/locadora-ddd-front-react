import { useState, useEffect } from 'react'
import Btn from './Btn'
import Icon from './Icon'

const inputBase = {
  width: "100%", background: "rgba(255,255,255,.05)",
  borderRadius: 9, padding: "10px 13px", color: "var(--text)",
  fontFamily: "var(--body)", fontSize: 14, outline: "none",
};

const inputStyle      = (hasError) => ({ ...inputBase, border: `1px solid ${hasError ? "var(--danger, #e74c3c)" : "var(--border)"}` });
const errorMsgStyle   = { color: "var(--danger, #e74c3c)", fontSize: 11, marginTop: 4, display: "block" };

// ════════════════════════════════════════════════════════════════
//  FORM MODAL
//  Props:
//    fieldErrors  — { nomeCampo: "mensagem" } vindo da page após resposta da API
// ════════════════════════════════════════════════════════════════
const FormModal = ({ open, title, fields, initialData, onSave, onClose, fieldErrors = {} }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(initialData ?? {});
  }, [initialData, open]);

  if (!open) return null;

  // Converte o valor do campo respeitando o tipo
  const handleChange = (f, rawValue) => {
    let value = rawValue;

    if (f.boolean) {
      // select booleano: "true" / "false" → boolean real
      value = rawValue === "true" || rawValue === true;
    } else if (f.type === "number") {
      value = rawValue === "" ? "" : Number(rawValue);
    }

    setForm(p => ({ ...p, [f.key]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  // Normaliza a chave para buscar no mapa de erros (case-insensitive)
  const getError = (key) => {
    const lower = key.toLowerCase();
    const found = Object.keys(fieldErrors).find(k => k.toLowerCase() === lower);
    return found ? fieldErrors[found] : null;
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 20, padding: 36, width: "100%", maxWidth: 520,
        animation: "fadeUp .22s", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h3 style={{ fontFamily: "var(--heading)", fontSize: 20, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 16px" }}>
            {fields.map(f => {
              const errMsg = getError(f.key);
              return (
                <div key={f.key} style={{ gridColumn: f.full ? "1 / -1" : "auto" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--muted)", marginBottom: 7, letterSpacing: .5, textTransform: "uppercase" }}>
                    {f.label}{f.required && <span style={{ color: "var(--danger, #e74c3c)", marginLeft: 3 }}>*</span>}
                  </label>

                  {f.type === "select" ? (
                    <select
                      value={form[f.key] ?? ""}
                      onChange={e => handleChange(f, e.target.value)}
                      style={inputStyle(!!errMsg)}
                    >
                      <option value="">Selecione...</option>
                      {f.options?.map(o => (
                        <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      placeholder={f.placeholder}
                      value={form[f.key] ?? ""}
                      onChange={e => handleChange(f, e.target.value)}
                      required={f.required}
                      rows={3}
                      style={{ ...inputStyle(!!errMsg), resize: "vertical" }}
                    />
                  ) : (
                    <input
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      value={form[f.key] ?? ""}
                      onChange={e => handleChange(f, e.target.value)}
                      required={f.required}
                      step={f.step}
                      style={inputStyle(!!errMsg)}
                    />
                  )}

                  {/* Mensagem de erro abaixo do campo */}
                  {errMsg && <span style={errorMsgStyle}>⚠ {errMsg}</span>}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 28 }}>
            <Btn variant="ghost" onClick={onClose} type="button">Cancelar</Btn>
            <Btn type="submit" variant="success"><Icon.Check /> Salvar</Btn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;