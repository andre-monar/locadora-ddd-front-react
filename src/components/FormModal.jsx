import { useState, useEffect } from 'react'
import Btn from './Btn'
import Icon from './Icon'

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,.05)",
  border: "1px solid var(--border)", borderRadius: 9,
  padding: "10px 13px", color: "var(--text)",
  fontFamily: "var(--body)", fontSize: 14,
  outline: "none",
};

// ════════════════════════════════════════════════════════════════
//  FORM MODAL — abre sobre a tela para novo/editar
// ════════════════════════════════════════════════════════════════
const FormModal = ({ open, title, fields, initialData, onSave, onClose }) => {
  const [form, setForm] = useState({});
 
  useEffect(() => {
    setForm(initialData ?? {});
  }, [initialData, open]);
 
  if (!open) return null;
 
  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };
 
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 20, padding: 36, width: "100%", maxWidth: 520,
        animation: "fadeUp .22s",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h3 style={{ fontFamily: "var(--heading)", fontSize: 20, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>
 
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 16px" }}>
            {fields.map(f => (
              <div key={f.key} style={{ gridColumn: f.full ? "1 / -1" : "auto" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--muted)", marginBottom: 7, letterSpacing: .5, textTransform: "uppercase" }}>
                  {f.label}
                </label>
                {f.type === "select" ? (
                  <select
                    value={form[f.key] ?? ""}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="">Selecione...</option>
                    {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    value={form[f.key] ?? ""}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    required={f.required}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}
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