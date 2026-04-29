import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ClientesPage from './pages/ClientesPage.jsx'
import CarrosPage from './pages/CarrosPage.jsx'
import AlocacoesPage from './pages/AlocacoesPage'
import CategoriaCarroPage from './pages/CategoriaCarroPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/carros" element={<CarrosPage/>} />
        <Route path="/alocacoes" element={<AlocacoesPage />} />
        <Route path="/categorias-carro" element={<CategoriaCarroPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App