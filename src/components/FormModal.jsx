import { useState, useEffect } from 'react'
import Btn from './Btn'
import Icon from './Icon'
import { formatCPF, formatCelular, formatCep } from '../utils/masks'

const inputBase = {
  width: "100%", background: "rgba(255,255,255,.05)",
  borderRadius: 9, padding: "10px 13px", color: "var(--text)",
  fontFamily: "var(--body)", fontSize: 14, outline: "none",
};

const inputStyle = (hasError) => ({ ...inputBase, border: `1px solid ${hasError ? "var(--danger, #e74c3c)" : "var(--border)"}` });
const errorMsgStyle = { color: "var(--danger, #e74c3c)", fontSize: 11, marginTop: 4, display: "block" };

const FormModal = ({ open, title, fields, initialData, onSave, onClose, fieldErrors = {} }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (initialData) {
      const formatted = { ...initialData };
      if (formatted.valorDiaria !== undefined && formatted.valorDiaria !== null) {
        formatted.valorDiaria = Number(formatted.valorDiaria).toFixed(2);
      }
      setForm(formatted);
    } else {
      setForm({});
    }
  }, [initialData, open]);

  if (!open) return null;

  const applyMask = (value, maskType) => {
    if (maskType === 'cpf') return formatCPF(value);
    if (maskType === 'celular') return formatCelular(value);
    if (maskType === 'cep') return formatCep(value);
    return value;
  };

  const handleChange = (f, rawValue) => {
    let value = rawValue;

    if (f.boolean) {
      value = rawValue === "true" || rawValue === true;
    } else if (f.type === "number") {
      value = rawValue === "" ? "" : Number(rawValue);
    } else if (f.mask) {
      value = applyMask(rawValue, f.mask);
    } else if (f.uppercase) {
      value = rawValue.toUpperCase();
    } else if (f.type === "file") {
      value = rawValue;
    }

    setForm(p => ({ ...p, [f.key]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  const getError = (key) => {
    const lower = key.toLowerCase();
    const found = Object.keys(fieldErrors).find(k => k.toLowerCase() === lower);
    return found ? fieldErrors[found] : null;
  };

  return (
    <>
      <style>{`
        select option {
          color: #fff;
          background: #1a1a2e;
        }
      `}</style>
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

          <form onSubmit={handleSubmit} noValidate>
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
                        style={{
                          ...inputStyle(!!errMsg),
                          color: "#fff",
                          colorScheme: "dark"
                        }}
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
                    ) : f.prefix === "R$" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "var(--muted)", fontSize: 14, fontWeight: 600 }}>R$</span>
                        <input
                          type="number"
                          placeholder={f.placeholder}
                          value={form[f.key] ?? ""}
                          onChange={e => handleChange(f, e.target.value)}
                          required={f.required}
                          step={f.step}
                          min={f.min ?? 0}
                          style={{ ...inputStyle(!!errMsg), flex: 1 }}
                        />
                      </div>
                    ) : f.type === "file" ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleChange(f, e.target.files[0])}
                        style={inputStyle(!!errMsg)}
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
    </>
  );
};

export default FormModal;