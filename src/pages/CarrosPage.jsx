import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
import { api } from '../services/api'

const CarrosPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, data: null });
  const [toast, setToast] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    api.get('/Carro')
      .then(data => setRows(data))
      .catch(() => setToast({ msg: "Erro ao carregar carros", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  // buscar categorias de carro tb
  useEffect(() => {
    api.get('/CategoriaCarro')
      .then(data => setCategorias(data.map(c => ({ value: c.id, label: c.nome }))))
      .catch(() => {});
  }, []);

  const buildFieldErrors = (erros) =>
    erros.reduce((acc, { campo, mensagem }) => ({ ...acc, [campo.toLowerCase()]: mensagem }), {});

  const closeModal = () => {
    setModal({ open: false, data: null });
    setFieldErrors({});
  };

  const handleSave = async data => {
  setFieldErrors({});
  
  // Validação do select de categoria
  if (!data.idCategoria || Number(data.idCategoria) <= 0) {
    setFieldErrors({ idcategoria: "Selecione uma categoria" });
    return; // não fecha o modal
  }
  
  try {
    const payload = { ...data, ativo: data.ativo === true || data.ativo === "true", idCategoria: Number(data.idCategoria) };
    // ... resto igual
      console.log("Payload enviado:", JSON.stringify(payload));
      if (data.id) {
        await api.put(`/Carro/${data.id}`, payload);
        setToast({ msg: "Veículo atualizado!", type: "success" });
      } else {
        await api.post('/Carro', payload);
        setToast({ msg: "Veículo criado!", type: "success" });
      }
      const lista = await api.get('/Carro');
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
      await api.delete(`/Carro/${row.id}`);
      setRows(r => r.filter(x => x.id !== row.id));
      setToast({ msg: "Veículo excluído.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };

  const fields = [
    { key: "marca", label: "Marca", required: true, type: "text" },
    { key: "modelo", label: "Modelo", required: true, type: "text" },
    { key: "placa", label: "Placa", required: true, type: "text", placeholder: "ABC1D23", uppercase: true},
    { key: "ano", label: "Ano", required: true, type: "number" },
    { key: "cor", label: "Cor", required: true, type: "text" },
    { key: "imagemUrl", label: "URL da Imagem", type: "url" },
    { key: "idCategoria", label: "Categoria", required: true, type: "select", options: categorias },
    {
      key: "ativo",
      label: "Ativo",
      type: "select",
      boolean: true,
      options: [{ value: true, label: "Sim" }, { value: false, label: "Não" }]
    },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "marca", label: "Marca" },
    { key: "modelo", label: "Modelo", primary: true },
    { key: "placa", label: "Placa" },
    { key: "ano", label: "Ano" },
    { key: "cor", label: "Cor" },
    { key: "categoria", label: "Categoria", render: (categoria) => categoria?.nome ?? "-" },
    {
      key: "ativo", label: "Ativo",
      render: v => v
        ? <span style={{ color: 'var(--accent2)' }}><Icon.Check /></span>
        : <span style={{ color: 'var(--muted)' }}><Icon.Close /></span>
    },
    {
      key: "disponivel", label: "Disponível",
      render: v => v
        ? <span style={{ color: 'var(--accent2)' }}><Icon.Check /></span>
        : <span style={{ color: 'var(--muted)' }}><Icon.Close /></span>
    },
    { key: "dataCriacao", label: "Criado em", render: v => v ? new Date(v).toLocaleString() : "-" },
    { key: "dataAlteracao", label: "Alterado em", render: v => v ? new Date(v).toLocaleString() : "-" },
  ];

  return (
    <>
      <CrudTable
        title="Carros" icon={<Icon.Car />} accent="var(--accent2)"
        columns={columns} rows={rows} loading={loading}
        onAdd={() => setModal({ open: true, data: { ativo: true } })}    // abre com ativo true
        onEdit={row => setModal({ open: true, data: { ...row, idCategoria: row.categoria?.id ?? row.idCategoria } })} // insere categoria atual pra iniciar o modal
        onDelete={handleDelete}
      />
      <FormModal
        open={modal.open}
        title={modal.data?.id ? "Editar Carro" : "Novo Carro"}
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

export default CarrosPage;