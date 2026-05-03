import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
import { api } from '../services/api'

const CategoriaCarroPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, data: null });
  const [toast, setToast] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    api.get('/CategoriaCarro')
      .then(data => setRows(data))
      .catch(() => setToast({ msg: "Erro ao carregar categorias", type: "error" }))
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
        valorDiaria: parseFloat(data.valorDiaria) || 0,
        ativo: data.ativo === true || data.ativo === "true"
      };
      console.log("Payload enviado:", JSON.stringify(payload));
      if (data.id) {
        await api.put(`/CategoriaCarro/${data.id}`, payload);
        setToast({ msg: "Categoria atualizada!", type: "success" });
      } else {
        await api.post('/CategoriaCarro', payload);
        setToast({ msg: "Categoria criada!", type: "success" });
      }
      const lista = await api.get('/CategoriaCarro');
      setRows(lista);
      closeModal();
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
      await api.delete(`/CategoriaCarro/${row.id}`);
      setRows(r => r.filter(x => x.id !== row.id));
      setToast({ msg: "Categoria excluída.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };

  const fields = [
    { key: "nome", label: "Nome", required: true },
    { key: "descricao", label: "Descrição", type: "textarea" },
    { key: "valorDiaria", label: "Valor da Diária", required: true, type: "number", placeholder: "50,00", step: "0.01", min: "0.01", prefix: "R$" },
    {
      key: "ativo", label: "Ativo", type: "select", boolean: true,
      options: [{ value: true, label: "Sim" }, { value: false, label: "Não" }]
    },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "nome", label: "Nome", primary: true },
    { key: "descricao", label: "Descrição" },
    { key: "valorDiaria", label: "Valor Diária", render: v => `R$ ${Number(v).toFixed(2)}` },
    {
      key: "ativo", label: "Ativo",
      render: v => v
        ? <span style={{ color: 'var(--accent2)' }}><Icon.Check /></span>
        : <span style={{ color: 'var(--muted)' }}><Icon.Close /></span>
    },
  ];

  return (
    <>
      <CrudTable
        title="Categorias de Carro" icon={<Icon.Category />} accent="var(--accent4)"
        columns={columns} rows={rows} loading={loading}
        onAdd={() => setModal({ open: true, data: { ativo: true, valorDiaria: "0.00" } })}   // abre com ativo true, valor em decimal
        onEdit={row => setModal({ open: true, data: row })}
        onDelete={handleDelete}
      />
      <FormModal
        open={modal.open}
        title={modal.data?.id ? "Editar Categoria" : "Nova Categoria"}
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

export default CategoriaCarroPage;