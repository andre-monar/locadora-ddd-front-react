import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
// ════════════════════════════════════════════════════════════════
//  CLIENTES PAGE
// ════════════════════════════════════════════════════════════════
const ClientesPage = () => {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, data: null });
  const [toast, setToast]     = useState(null);
 
  // ── Simulação de chamada à API (substituir por fetch real) ──
  useEffect(() => {
    setTimeout(() => {
      setRows([
        {
          id: 1,
          nome: "Ana Paula Souza",
          cpf: "12345678901",
          dataNascimento: "1990-05-15",
          celular: "11987654321",
          email: "ana@exemplo.com",
          cep: "01001000",
          endereco: "Rua Exemplo, 123",
          complementoEndereco: "Apto 45",
          ativo: true,
          dataCriacao: "2025-03-10T08:00:00",
          dataAlteracao: null,
        },
        {
          id: 2,
          nome: "Carlos Lima",
          cpf: "98765432100",
          dataNascimento: "1985-07-20",
          celular: "11912345678",
          email: "carlos@exemplo.com",
          cep: "02002000",
          endereco: "Av. Paulista, 1000",
          complementoEndereco: "",
          ativo: false,
          dataCriacao: "2025-04-01T12:30:00",
          dataAlteracao: "2025-04-15T09:45:00",
        },
      ]);
      setLoading(false);
    }, 900);
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
 
  const handleSave = data => {
    // Prepara dados – campos automáticos são definidos no ato da criação/edição
    const now = new Date().toISOString();
    const newData = {
      ...data,
      ativo: data.ativo !== undefined ? data.ativo : true, // default true
      dataAlteracao: now,
    };

    if (data.id) {
      // Atualização: mantém dataCriacao original
      setRows(r => r.map(x => x.id === data.id ? { ...x, ...newData } : x));
      setToast({ msg: "Cliente atualizado!", type: "success" });
    } else {
      // Criação: gera id e dataCriacao
      setRows(r => [...r, { ...newData, id: Date.now(), dataCriacao: now }]);
      setToast({ msg: "Cliente criado!", type: "success" });
    }
    setModal({ open: false, data: null });
  };
 
  const handleDelete = row => {
    // TODO: DELETE /api/Cliente/{row.id}
    setRows(r => r.filter(x => x.id !== row.id));
    setToast({ msg: "Cliente excluído.", type: "success" });
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