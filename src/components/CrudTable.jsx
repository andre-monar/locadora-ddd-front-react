import { useState } from 'react'
import Btn from './Btn'
import Icon from './Icon'
import DeleteModal from './DeleteModal'
// ════════════════════════════════════════════════════════════════
//  CRUD TABLE — componente genérico reutilizável pelas 3 entidades
// ════════════════════════════════════════════════════════════════
const CrudTable = ({ title, icon, accent, columns, rows, loading, onAdd, onEdit, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
 
  return (
    <div style={{ animation: "fadeUp .4s both" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ color: accent, background: `${accent}18`, borderRadius: 12, padding: "9px 11px", display: "flex" }}>{icon}</div>
          <h2 style={{ fontFamily: "var(--heading)", fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>{title}</h2>
        </div>
        <Btn onClick={onAdd}><Icon.Plus /> Novo registro</Btn>
      </div>
 
      {/* Table */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,.03)", borderBottom: "1px solid var(--border)" }}>
              {columns.map(c => (
                <th key={c.key} style={{
                  padding: "14px 20px", textAlign: "left",
                  fontFamily: "var(--heading)", fontWeight: 600, fontSize: 12,
                  color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase",
                }}>{c.label}</th>
              ))}
              <th style={{ padding: "14px 20px", width: 100 }} />
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                {[...columns, { key: "_" }].map((c, j) => (
                  <td key={j} style={{ padding: "16px 20px" }}>
                    <div className="skeleton" style={{ height: 18, width: j === columns.length ? 80 : "70%" }} />
                  </td>
                ))}
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: 48, textAlign: "center", color: "var(--muted)", fontSize: 15 }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
            {!loading && rows.map((row, i) => (
              <tr key={row.id ?? i}
                style={{ borderBottom: "1px solid var(--border)", transition: "var(--trans)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.025)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}
              >
                {columns.map(c => (
                  <td key={c.key} style={{ padding: "15px 20px", color: c.primary ? "var(--text)" : "var(--muted)" }}>
                    {c.render ? c.render(row[c.key], row) : row[c.key] ?? "—"}
                  </td>
                ))}
                <td style={{ padding: "15px 20px" }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <Btn small variant="ghost" onClick={() => onEdit(row)}><Icon.Edit /></Btn>
                    <Btn small variant="danger" onClick={() => setDeleteTarget(row)}><Icon.Trash /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <DeleteModal
        open={!!deleteTarget}
        name={deleteTarget?.nome || deleteTarget?.modelo || deleteTarget?.id || "este registro"}
        onConfirm={() => { onDelete(deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CrudTable;