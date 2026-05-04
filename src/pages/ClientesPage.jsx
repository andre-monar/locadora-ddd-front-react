import { useState, useEffect } from 'react'
import CrudTable, { fmtData, fmtDateTime } from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
import { api } from '../services/api'
import { formatCPF, formatCelular, formatCep } from '../utils/masks';

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
        cpf: data.cpf?.replace(/\D/g, '') || "",
        celular: data.celular?.replace(/\D/g, '') || "",
        cep: data.cep?.replace(/\D/g, '') || "",
        endereco: data.endereco || "",
        complementoEndereco: data.complementoEndereco || ""
      };
      console.log("Enviando payload:", payload);
      if (data.id) {
        
        await api.put(`/Cliente/${data.id}`, payload);
        setToast({ msg: "Cliente atualizado!", type: "success" });
      } else {
        await api.post('/Cliente', payload);
        setToast({ msg: "Cliente criado!", type: "success" });
      }
      
      // Recarrega a lista
      const lista = await api.get('/Cliente');
      setRows(lista);
      closeModal(); // fecha o modal
      
    } catch (e) {
      if (e.erros) {
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
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };

  const fields = [
    { key: "nome",                label: "Nome",             required: true, type: "text", full: true },
    { key: "cpf",                 label: "CPF",              required: true, type: "text",  placeholder: "000.000.000-00", mask: "cpf" },
    { key: "celular",             label: "Celular",          required: true, type: "text",  placeholder: "(00) 00000-0000", mask: "celular" },
    { key: "dataNascimento",      label: "Data de Nascimento", required: true, type: "date" },
    { key: "email",               label: "E-mail",           required: true, type: "email", placeholder: "email@exemplo.com", full: true },
    { key: "cep",                 label: "CEP",              type: "text",  placeholder: "00000-000", mask: "cep" },
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
    { key: "cpf",              label: "CPF", render: v => v ? formatCPF(v) : "-" },
    { key: "dataNascimento",   label: "Nascimento", render: v => fmtData(v) },
    { key: "celular",          label: "Celular", render: v => v ? formatCelular(v) : "-" },
    { key: "email",            label: "E-mail" },
    { key: "cep",              label: "CEP", render: v => v ? formatCep(v) : "-" },
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
        onEdit={row => {
          const formatted = {
            ...row,
            cpf: formatCPF(row.cpf || ''),
            celular: formatCelular(row.celular || ''),
            cep: formatCep(row.cep || ''),
          };
          setModal({ open: true, data: formatted });
        }}
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