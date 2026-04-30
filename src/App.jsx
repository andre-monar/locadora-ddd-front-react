import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ClientesPage from './pages/ClientesPage.jsx'
import CarrosPage from './pages/CarrosPage.jsx'
import AlocacoesPage from './pages/AlocacoesPage'
import CategoriaCarroPage from './pages/CategoriaCarroPage'
import Navbar from './components/Navbar.jsx'
function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/carros" element={<CarrosPage />} />
          <Route path="/alocacoes" element={<AlocacoesPage />} />
          <Route path="/categorias-carro" element={<CategoriaCarroPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App