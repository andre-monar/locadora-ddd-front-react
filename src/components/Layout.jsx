// ─── Layout wrapper ──────────────────────────────────────────────
const Layout = ({ children, page, onNav }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {/* Navbar */}
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(13,15,20,.85)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 36px", height: 62,
    }}>
      <span
        onClick={() => onNav("home")}
        style={{ fontFamily: "var(--heading)", fontWeight: 800, fontSize: 20, cursor: "pointer", letterSpacing: -0.5 }}
      >
        <span style={{ color: "var(--accent1)" }}>Loca</span>
        <span style={{ color: "var(--accent2)" }}>DDD</span>
      </span>
      <nav style={{ display: "flex", gap: 4 }}>
        {[
          { id: "clientes",  label: "Clientes" },
          { id: "carros",  label: "Carros" },
          { id: "alocacoes", label: "Alocações" },
        ].map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            style={{
              fontFamily: "var(--body)", fontSize: 13.5, fontWeight: 500,
              background: page === item.id ? "rgba(108,99,255,.15)" : "transparent",
              color: page === item.id ? "var(--accent1)" : "var(--muted)",
              border: page === item.id ? "1px solid rgba(108,99,255,.3)" : "1px solid transparent",
              borderRadius: 8, padding: "6px 14px", cursor: "pointer",
              transition: "var(--trans)",
            }}
          >{item.label}</button>
        ))}
      </nav>
    </header>
 
    {/* Content */}
    <main style={{ flex: 1, padding: "40px 36px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
      {children}
    </main>
  </div>
);
export default Layout;