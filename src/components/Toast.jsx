import { useEffect } from 'react'
import Icon from './Icon'

// ─── Toast de feedback ───────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  if (!msg) return null;
  const color = type === "error" ? "var(--accent3)" : "var(--accent2)";
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 2000,
      background: "var(--card)", border: `1px solid ${color}`,
      borderRadius: 12, padding: "13px 20px", fontSize: 14,
      display: "flex", alignItems: "center", gap: 10,
      animation: "fadeUp .25s", color,
    }}>
      {type !== "error" && <Icon.Check />}{msg}
    </div>
  );
};

export default Toast;