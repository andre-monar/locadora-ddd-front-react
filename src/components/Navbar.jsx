import { useNavigate, useLocation } from 'react-router-dom'
import Icon from './Icon'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', padding: '16px 0', marginBottom: 8,
      borderBottom: '1px solid var(--border)'
    }}>
      {!isHome && (
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', color: 'var(--muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: 8, fontSize: 14, fontFamily: 'var(--body)'
          }}
        >
          <Icon.Back /> Voltar ao início
        </button>
      )}
    </nav>
  );
};

export default Navbar;