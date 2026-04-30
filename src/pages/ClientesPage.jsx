import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
import { api } from '../services/api'

const ClientesPage = () => {
  const [rows, setRows]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState({ open: false, data: null });
  const [toast, setToast]           = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    api.get('/Cliente')
      .then(data => setRows(data))
      .catch(() => setToast({ msg: "Erro ao carregar clientes", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const buildFieldErrors = (erros) =>
    erros.reduce((acc, { campo, mensagem }) => ({ ...acc, [campo.toLowerCase()]: mensagem }), {});

  const closeModal = () => {
    setModal({ open: false, data: null });
    setFieldErrors({});
  };

  const handleSave = async data => {
    setFieldErrors({});
    try {
      const payload = {
        ...data,
        ativo: data.ativo === true || data.ativo === "true",
        cep: data.cep || "",
        endereco: data.endereco || "",
        complementoEndereco: data.complementoEndereco || ""
      };
      
      if (data.id) {
        await api.put(`/Cliente/${data.id}`, payload);
      } else {
        await api.post('/Cliente', payload);
      }
      // ...
    } catch (e) {
      if (e.erros) {
        console.log("Erros de campo:", e.erros);
        setFieldErrors(buildFieldErrors(e.erros));
      } else {
        setToast({ msg: e.message, type: "error" });
      }
    }
  };

  const handleDelete = async row => {
    try {
      await api.delete(`/Cliente/${row.id}`);
      setRows(r => r.filter(x => x.id !== row.id));
      setToast({ msg: "Cliente excluído.", type: "success" });
      console.log("Enviando payload:", payload);  // ← log
    } catch (e) {
            console.log("Erro recebido:", e);  // ← log
      setToast({ msg: e.message, type: "error" });
    }
  };

  const fields = [
    { key: "nome",                label: "Nome",             required: true, type: "text", full: true },
    { key: "cpf",                 label: "CPF",              required: true, type: "text",  placeholder: "00000000000" },
    { key: "celular",             label: "Celular",          required: true, type: "text",  placeholder: "54999999999" },
    { key: "dataNascimento",      label: "Data de Nascimento", required: true, type: "date" },
    { key: "email",               label: "E-mail",           required: true, type: "email", full: true },
    { key: "cep",                 label: "CEP",              type: "text",  placeholder: "00000000" },
    { key: "endereco",            label: "Endereço",         type: "text",  full: true },
    { key: "complementoEndereco", label: "Complemento",      type: "text",  full: true },
    {
      key: "ativo", label: "Ativo", type: "select", boolean: true,
      options: [{ value: true, label: "Sim" }, { value: false, label: "Não" }]
    },
  ];

  const columns = [
    { key: "id",               label: "ID" },
    { key: "nome",             label: "Nome",        primary: true },
    { key: "cpf",              label: "CPF" },
    { key: "dataNascimento",   label: "Nascimento",  render: v => v ? new Date(v).toLocaleDateString() : "-" },
    { key: "celular",          label: "Celular" },
    { key: "email",            label: "E-mail" },
    { key: "cep",              label: "CEP" },
    { key: "endereco",         label: "Endereço" },
    { key: "ativo",            label: "Ativo",       render: v => v ? <span style={{ color: 'var(--accent2)' }}><Icon.Check /></span> : <span style={{ color: 'var(--muted)' }}><Icon.Close /></span> },
    { key: "dataCriacao",      label: "Criado em",   render: v => v ? new Date(v).toLocaleString() : "-" },
    { key: "dataAlteracao",    label: "Alterado em", render: v => v ? new Date(v).toLocaleString() : "-" },
  ];

  return (
    <>
      <CrudTable
        title="Clientes" icon={<Icon.User />} accent="var(--accent1)"
        columns={columns} rows={rows} loading={loading}
        onAdd={() => setModal({ open: true, data: { ativo: true } })}   // inicia com ativo true
        onEdit={row => setModal({ open: true, data: row })}
        onDelete={handleDelete}
      />
      <FormModal
        open={modal.open}
        title={modal.data?.id ? "Editar Cliente" : "Novo Cliente"}
        fields={fields}
        initialData={modal.data}
        fieldErrors={fieldErrors}
        onSave={handleSave}
        onClose={closeModal}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default ClientesPage;