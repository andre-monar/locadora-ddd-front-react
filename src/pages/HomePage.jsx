import Icon from '../components/Icon'
import { useNavigate } from 'react-router-dom'

// ════════════════════════════════════════════════════════════════
//  HOME PAGE
// ════════════════════════════════════════════════════════════════
const HomePage = () => {
  const navigate = useNavigate();
  const cards = [
    {
      id: "clientes",
      icon: <Icon.User />,
      label: "Clientes",
      desc: "Cadastro de clientes, CNH, endereço e contato.",
      accent: "var(--accent1)",
      glow: "rgba(108,99,255,.25)",
    },
    {
      id: "veiculos",
      icon: <Icon.Car />,
      label: "Carros",
      desc: "Frota disponível: modelo, marca, placa e grupo.",
      accent: "var(--accent2)",
      glow: "rgba(0,212,170,.25)",
    },
    {
      id: "alocacoes",
      icon: <Icon.Rental />,
      label: "Alocações",
      desc: "Controle de locações, datas e status de devolução.",
      accent: "var(--accent3)",
      glow: "rgba(255,107,107,.25)",
    },
  ];
 
  return (
    <div>
      {/* Hero */}
      <div style={{
        textAlign: "center", padding: "60px 0 56px",
        animation: "fadeUp .5s both",
      }}>
        {/* Decorative gradient blob */}
        <div style={{
          position: "absolute", left: "50%", top: 120,
          transform: "translateX(-50%)",
          width: 600, height: 280,
          background: "radial-gradient(ellipse, rgba(108,99,255,.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <p style={{ color: "var(--accent1)", fontFamily: "var(--heading)", fontWeight: 600, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18 }}>
          Sistema de Locação de Carros
        </p>
        <h1 style={{
          fontFamily: "var(--heading)", fontWeight: 800,
          fontSize: "clamp(36px, 5vw, 58px)", lineHeight: 1.1,
          letterSpacing: -1.5, marginBottom: 18,
        }}>
          Bem-vindo ao{" "}
          <span style={{ background: "linear-gradient(135deg, var(--accent1), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            LocaDDD
          </span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 460, margin: "0 auto 40px", lineHeight: 1.65 }}>
          Gerencie clientes, frota e alocações em um só lugar.
          Selecione um módulo para começar.
        </p>
      </div>
 
      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, animation: "fadeUp .6s .12s both" }}>
        {cards.map(({ id, icon, label, desc, accent, glow }) => (
          <button key={id} onClick={() => navigate(`/${id}`)}
            style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 18, padding: "36px 32px", cursor: "pointer",
              textAlign: "left", transition: "var(--trans)",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${accent}55`;
              e.currentTarget.style.boxShadow = `0 0 32px ${glow}`;
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = "1px solid var(--border)";
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.transform = "";
            }}
          >
            {/* icon circle */}
            <div style={{
              width: 58, height: 58, borderRadius: 14,
              background: `${accent}18`, color: accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 22,
            }}>{icon}</div>
 
            <p style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 22, marginBottom: 9, color: "var(--text)" }}>{label}</p>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
 
            {/* decorative corner gradient */}
            <div style={{
              position: "absolute", bottom: -30, right: -30,
              width: 120, height: 120, borderRadius: "50%",
              background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />
          </button>
        ))}
      </div>
    </div>
  );
};
export default HomePage;