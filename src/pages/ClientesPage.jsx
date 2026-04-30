import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
import { api } from '../services/api';

// ════════════════════════════════════════════════════════════════
//  CLIENTES PAGE
// ════════════════════════════════════════════════════════════════
const ClientesPage = () => {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, data: null });
  const [toast, setToast]     = useState(null);
 
  // ── Chamada à API ──
  useEffect(() => {
    api.get('/Cliente')
      .then(data => {
        console.log("Dados recebidos:", data);
        setRows(data);
        setLoading(false);
      })
      .catch(err => console.error("Erro:", err))
      .finally(() => setLoading(false));
  }, []);
 
  const fields = [
    { key: "nome",                label: "Nome",            required: true, type: "text" },
    { key: "cpf",                 label: "CPF",             required: true, type: "text", placeholder: "00000000000" },
    { key: "dataNascimento",      label: "Data de Nascimento", required: true, type: "date" },
    { key: "celular",             label: "Celular",         required: true, type: "text", placeholder: "54999999999" },
    { key: "email",               label: "E-mail",          required: true, type: "email" },
    { key: "cep",                 label: "CEP",             type: "text", placeholder: "00000000" },
    { key: "endereco",            label: "Endereço",        type: "text" },
    { key: "complementoEndereco", label: "Complemento",     type: "text" },
    {
      key: "ativo",
      label: "Ativo",
      type: "select",
      options: [
        { value: true, label: "Sim" },
        { value: false, label: "Não" }
      ]
    },
  ];
 
  const columns = [
    { key: "id",                 label: "ID" },
    { key: "nome",               label: "Nome",             primary: true },
    { key: "cpf",                label: "CPF" },
    { key: "dataNascimento",     label: "Nascimento",       render: v => v ? new Date(v).toLocaleDateString() : "-" },
    { key: "celular",            label: "Celular" },
    { key: "email",              label: "E-mail" },
    { key: "cep",                label: "CEP" },
    { key: "endereco",           label: "Endereço" },
    { 
      key: "ativo", 
      label: "Ativo",            
      render: v => v 
        ? <span style={{ color: 'var(--accent2)' }}><Icon.Check /></span> 
        : <span style={{ color: 'var(--muted)' }}><Icon.Close /></span>
    },
    { key: "dataCriacao",        label: "Criado em",        render: v => v ? new Date(v).toLocaleString() : "-" },
    { key: "dataAlteracao",      label: "Alterado em",      render: v => v ? new Date(v).toLocaleString() : "-" },
  ];
 
  const handleSave = async data => {
    try {
      if (data.id) {
        await api.put(`/Cliente/${data.id}`, data);
        setToast({ msg: "Cliente atualizado!", type: "success" });
      } else {
        await api.post('/Cliente', data);
        setToast({ msg: "Cliente criado!", type: "success" });
      }
      // Recarrega lista atualizada
      const lista = await api.get('/Cliente');
      setRows(lista);
      setModal({ open: false, data: null });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };
 
  const handleDelete = async row => {
    try {
      await api.delete(`/Cliente/${row.id}`);
      setRows(r => r.filter(x => x.id !== row.id));
      setToast({ msg: "Cliente excluído.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };
 
  return (
    <>
      <CrudTable
        title="Clientes" icon={<Icon.User />} accent="var(--accent1)"
        columns={columns} rows={rows} loading={loading}
        onAdd={() => setModal({ open: true, data: null })}
        onEdit={row => setModal({ open: true, data: row })}
        onDelete={handleDelete}
      />
      <FormModal
        open={modal.open}
        title={modal.data?.id ? "Editar Cliente" : "Novo Cliente"}
        fields={fields}
        initialData={modal.data}
        onSave={handleSave}
        onClose={() => setModal({ open: false, data: null })}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default ClientesPage;