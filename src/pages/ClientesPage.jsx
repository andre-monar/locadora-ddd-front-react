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
        { id: 1, nome: "Ana Paula Souza", cpf: "123.456.789-00", cnh: "98765", celular: "(11) 91234-5678", estado: true },
        { id: 2, nome: "Carlos Lima",     cpf: "987.654.321-00", cnh: "12345", celular: "(21) 99876-5432", estado: true },
      ]);
      setLoading(false);
    }, 900);
  }, []);
 
  const fields = [
    { key: "nome",                label: "Nome completo",       required: true,  full: true },
    { key: "cpf",                 label: "CPF",                 required: true,  placeholder: "000.000.000-00" },
    { key: "cnh",                 label: "CNH",                 required: true },
    { key: "celular",             label: "Celular",             placeholder: "(11) 9..." },
    { key: "cep",                 label: "CEP",                 placeholder: "00000-000" },
    { key: "endereco",            label: "Endereço",            full: true },
    { key: "complementoEndereco", label: "Complemento",         full: true },
    { key: "estado", label: "Ativo", type: "select",
      options: [{ value: "true", label: "Sim" }, { value: "false", label: "Não" }] },
  ];
 
  const columns = [
    { key: "nome",    label: "Nome",    primary: true },
    { key: "cpf",     label: "CPF" },
    { key: "cnh",     label: "CNH" },
    { key: "celular", label: "Celular" },
    { key: "estado",  label: "Status", render: v => (
      <span style={{ color: v ? "var(--accent2)" : "var(--accent3)", fontSize: 12, fontWeight: 600 }}>
        {v ? "● Ativo" : "○ Inativo"}
      </span>
    )},
  ];
 
  const handleSave = data => {
    // TODO: POST /api/Cliente  ou  PUT /api/Cliente/{id}
    if (data.id) {
      setRows(r => r.map(x => x.id === data.id ? { ...x, ...data } : x));
      setToast({ msg: "Cliente atualizado!", type: "success" });
    } else {
      const newRow = { ...data, id: Date.now() };
      setRows(r => [...r, newRow]);
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