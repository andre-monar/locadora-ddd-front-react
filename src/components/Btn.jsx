// ─── Botão base ──────────────────────────────────────────────────
const Btn = ({ children, variant = "primary", onClick, type = "button", small, style: extraStyle }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 7,
    fontFamily: "var(--body)", fontWeight: 500, cursor: "pointer",
    border: "none", borderRadius: 10, transition: "var(--trans)",
    padding: small ? "7px 14px" : "11px 22px",
    fontSize: small ? 13 : 14,
    ...extraStyle,
  };
  const styles = {
    primary: { background: "var(--accent1)", color: "#fff" },
    ghost:   { background: "rgba(255,255,255,0.05)", color: "var(--text)", border: "1px solid var(--border)" },
    danger:  { background: "rgba(255,107,107,0.12)", color: "var(--accent3)", border: "1px solid rgba(255,107,107,.25)" },
    success: { background: "rgba(0,212,170,0.12)", color: "var(--accent2)", border: "1px solid rgba(0,212,170,.25)" },
  };
  return (
    <button type={type} onClick={onClick} style={{ ...base, ...styles[variant] }}
      onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.15)"}
      onMouseLeave={e => e.currentTarget.style.filter = ""}
    >{children}</button>
  );
};
export default Btn;