import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
// ════════════════════════════════════════════════════════════════
//  Carros PAGE
// ════════════════════════════════════════════════════════════════
const grupoOpts = [
  { value: "0", label: "Econômico" },
  { value: "1", label: "Intermediário" },
  { value: "2", label: "Executivo" },
  { value: "3", label: "SUV" },
  { value: "4", label: "Premium" },
];
 
const CarrosPage = () => {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, data: null });
  const [toast, setToast]     = useState(null);
 
  useEffect(() => {
    // simulação de dados
    setTimeout(() => {
      setRows([
        {
          id: 1,
          modelo: "Onix",
          marca: "Chevrolet",
          placa: "ABC1D23",
          ano: 2022,
          cor: "Prata",
          imagemUrl: "",
          idCategoria: 1,
          ativo: true,
          disponivel: true,
          dataAlteracao: "2025-04-20T10:30:00"
        },
        {
          id: 2,
          modelo: "Corolla",
          marca: "Toyota",
          placa: "XYZ9A87",
          ano: 2023,
          cor: "Preto",
          imagemUrl: "https://exemplo.com/corolla.jpg",
          idCategoria: 2,
          ativo: true,
          disponivel: false,
          dataAlteracao: "2025-04-18T14:15:00"
        },
      ]);
      setLoading(false);
    }, 900);
  }, []);
 
  const fields = [
    { key: "modelo",      label: "Modelo",        required: true, type: "text" },
    { key: "marca",       label: "Marca",         required: true, type: "text" },
    { key: "placa",       label: "Placa",         required: true, type: "text", placeholder: "ABC1D23" },
    { key: "ano",         label: "Ano",           required: true, type: "number" },
    { key: "cor",         label: "Cor",           required: true, type: "text" },
    { key: "imagemUrl",   label: "URL da Imagem", type: "url" },
    { key: "idCategoria", label: "ID da Categoria", required: true, type: "number" },
    { 
      key: "ativo", 
      label: "Ativo", 
      type: "select", 
      options: [{ value: true, label: "Sim" }, { value: false, label: "Não" }] 
    },
  ];

  const columns = [
    { key: "id",           label: "ID" },
    { key: "modelo",       label: "Modelo",       primary: true },
    { key: "marca",        label: "Marca" },
    { key: "placa",        label: "Placa" },
    { key: "ano",          label: "Ano" },
    { key: "cor",          label: "Cor" },
    { key: "idCategoria",  label: "Categoria" },
    { 
  key: "ativo", 
  label: "Ativo", 
    render: v => v 
      ? <span style={{ color: 'var(--accent2)' }}><Icon.Check /></span> 
      : <span style={{ color: 'var(--muted)' }}><Icon.Close /></span>
  },
  { 
    key: "disponivel", 
    label: "Disponível",
    render: v => v 
      ? <span style={{ color: 'var(--accent2)' }}><Icon.Check /></span> 
      : <span style={{ color: 'var(--muted)' }}><Icon.Close /></span>
  },
    { 
      key: "dataAlteracao", 
      label: "Alterado em", 
      render: v => v ? new Date(v).toLocaleString() : "-" 
    },
  ];

  const handleSave = data => {
    const newData = {
      ...data,
      // Garante que campos não editáveis mantenham valores padrão
      disponivel: data.disponivel ?? false,
      dataAlteracao: new Date().toISOString(),
      ativo: data.ativo !== undefined ? data.ativo : true,
    };

    if (data.id) {
      setRows(r => r.map(x => x.id === data.id ? { ...x, ...newData } : x));
      setToast({ msg: "Carro atualizado!", type: "success" });
    } else {
      setRows(r => [...r, { ...newData, id: Date.now() }]);
      setToast({ msg: "Carro criado!", type: "success" });
    }
    setModal({ open: false, data: null });
  };
 
  const handleDelete = row => {
    setRows(r => r.filter(x => x.id !== row.id));
    setToast({ msg: "Carro excluído.", type: "success" });
  };
 
  return (
    <>
      <CrudTable
        title="Carros" icon={<Icon.Car />} accent="var(--accent2)"
        columns={columns} rows={rows} loading={loading}
        onAdd={() => setModal({ open: true, data: null })}
        onEdit={row => setModal({ open: true, data: row })}
        onDelete={handleDelete}
      />
      <FormModal
        open={modal.open}
        title={modal.data?.id ? "Editar Carro" : "Novo Carro"}
        fields={fields}
        initialData={modal.data}
        onSave={handleSave}
        onClose={() => setModal({ open: false, data: null })}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default CarrosPage;