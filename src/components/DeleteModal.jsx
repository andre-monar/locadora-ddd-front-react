
import Btn from './Btn'
import Icon from './Icon'
// ─── Modal de confirmação de exclusão ───────────────────────────
const DeleteModal = ({ open, name, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", padding: 32, maxWidth: 380, width: "90%", animation: "fadeUp .2s" }}>
        <p style={{ fontFamily: "var(--heading)", fontSize: 18, marginBottom: 10 }}>Confirmar exclusão</p>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
          Deseja realmente excluir <strong style={{ color: "var(--text)" }}>{name}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
          <Btn variant="danger" onClick={onConfirm}><Icon.Trash /> Excluir</Btn>
        </div>
      </div>
    </div>
  );
};
 
export default DeleteModal;