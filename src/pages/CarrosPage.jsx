import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
import { api } from '../services/api'
// ════════════════════════════════════════════════════════════════
//  CARROS PAGE
// ════════════════════════════════════════════════════════════════

const CarrosPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, data: null });
  const [toast, setToast] = useState(null);

  // ── Carrega carros da API ──
  useEffect(() => {
    api.get('/Carro')
      .then(data => setRows(data))
      .catch(() => setToast({ msg: "Erro ao carregar veículos", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const fields = [
    { key: "modelo",       label: "Modelo",        required: true, type: "text" },
    { key: "marca",        label: "Marca",         required: true, type: "text" },
    { key: "placa",        label: "Placa",         required: true, type: "text", placeholder: "ABC1D23" },
    { key: "ano",          label: "Ano",           required: true, type: "number" },
    { key: "cor",          label: "Cor",           required: true, type: "text" },
    { key: "imagemUrl",    label: "URL da Imagem", type: "url" },
    { key: "idCategoria",  label: "ID da Categoria", required: true, type: "number" },
    { 
      key: "ativo", 
      label: "Ativo", 
      type: "select", 
      options: [{ value: true, label: "Sim" }, { value: false, label: "Não" }] 
    },
  ];

  const columns = [
    { key: "id",           label: "ID" },
    { key: "modelo",       label: "Modelo",        primary: true },
    { key: "marca",        label: "Marca" },
    { key: "placa",        label: "Placa" },
    { key: "ano",          label: "Ano" },
    { key: "cor",          label: "Cor" },
    { 
      key: "categoria", 
      label: "Categoria", 
      render: (categoria) => categoria?.nome ?? "-" 
    },
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

  const handleSave = async data => {
    try {
      if (data.id) {
        await api.put(`/Carro/${data.id}`, data);
        setToast({ msg: "Veículo atualizado!", type: "success" });
      } else {
        await api.post('/Carro', data);
        setToast({ msg: "Veículo criado!", type: "success" });
      }
      // recarrega a lista atualizada
      const lista = await api.get('/Carro');
      setRows(lista);
      setModal({ open: false, data: null });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };

  const handleDelete = async row => {
    try {
      await api.delete(`/Carro/${row.id}`);
      setRows(r => r.filter(x => x.id !== row.id));
      setToast({ msg: "Veículo excluído.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
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