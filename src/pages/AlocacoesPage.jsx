import { useState, useEffect } from 'react'
import CrudTable, { fmtData, fmtDateTime } from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
import { api } from '../services/api'

const statusColor = { 1: "#00d4aa", 2: "#6b7280", 3: "#ff6b6b" };

const AlocacoesPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, data: null });
  const [toast, setToast] = useState(null);
  const [statusOpts, setStatusOpts] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [carrosOpts, setCarrosOpts] = useState([]);
  const [clientesOpts, setClientesOpts] = useState([]);

  useEffect(() => {
    api.get('/AlocacaoStatus')
      .then(data => setStatusOpts(data))
      .catch(() => setStatusOpts([]));
  }, []);

  useEffect(() => {
    api.get('/Alocacao')
      .then(data => setRows(data))
      .catch(() => setToast({ msg: "Erro ao carregar alocações", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  // buscar carros e clientes
  useEffect(() => {
    api.get('/Carro')
      .then(data => setCarrosOpts(data.map(c => ({ value: c.id, label: `${c.modelo} - ${c.placa}` }))))
      .catch(() => {});
    api.get('/Cliente')
      .then(data => setClientesOpts(data.map(c => ({ value: c.id, label: c.nome }))))
      .catch(() => {});
  }, []);
  const buildFieldErrors = (erros) =>
    erros.reduce((acc, { campo, mensagem }) => ({ ...acc, [campo.toLowerCase()]: mensagem }), {});

  const closeModal = () => {
    setModal({ open: false, data: null });
    setFieldErrors({});
  };

  const handleBaixa = async row => {
    try {
      await api.put(`/Alocacao/${row.id}/baixa`);
      setToast({ msg: "Devolução registrada!", type: "success" });
      const lista = await api.get('/Alocacao');
      setRows(lista);
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };

  const handleCancelar = async row => {
    try {
      await api.put(`/Alocacao/${row.id}/cancelar`);
      setToast({ msg: "Alocação cancelada!", type: "success" });
      const lista = await api.get('/Alocacao');
      setRows(lista);
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };

  const handleSave = async data => {
    setFieldErrors({});
    try {
      const payload = {
        ...data,
        status: Number(data.status),
        dataDevolucao: data.dataDevolucao || null,
      };
      console.log("Payload enviado:", JSON.stringify(payload));
      if (data.id) {
        await api.put(`/Alocacao/${data.id}`, payload);
        setToast({ msg: "Alocação atualizada!", type: "success" });
      } else {
        await api.post('/Alocacao', payload);
        setToast({ msg: "Alocação criada!", type: "success" });
      }
      const lista = await api.get('/Alocacao');
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
      await api.delete(`/Alocacao/${row.id}`);
      setRows(r => r.filter(x => x.id !== row.id));
      setToast({ msg: "Alocação excluída.", type: "success" });
    } catch (e) {
      setToast({ msg: e.message, type: "error" });
    }
  };

  const fields = [
    { key: "idCarro", label: "Carro", required: true, type: "select", options: carrosOpts },
    { key: "idCliente", label: "Cliente", required: true, type: "select", options: clientesOpts },
    { key: "dataRetirada", label: "Data de Retirada", required: true, type: "date" },
    { key: "dataPrevistaDevolucao", label: "Previsão Devolução", required: true, type: "date" },
    { key: "dataDevolucao", label: "Data de Devolução", type: "date" },
    { key: "status", label: "Status", type: "select", options: statusOpts, required: true },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "idCliente", label: "ID Cliente" },
    { key: "cliente", label: "Cliente", primary: true, render: c => c?.nome ?? "-" },
    { key: "idCarro", label: "ID Carro" },
    { key: "carro", label: "Carro", render: c => c?.modelo ?? "-" },
    { key: "dataRetirada", label: "Retirada", render: v => fmtData(v)  },
    { key: "dataPrevistaDevolucao", label: "Prev. Devolução", render: v => fmtData(v)  },
    { key: "dataDevolucao", label: "Devolução", render: v => fmtData(v) },
    { key: "valorTotal", label: "Valor Total", render: v => v != null ? `R$ ${Number(v).toFixed(2)}` : "-" },
    { key: "status", label: "Status", render: v => (
      <span style={{ color: statusColor[v] ?? "var(--muted)", fontSize: 12, fontWeight: 600 }}>
        ● {statusOpts.find(o => Number(o.value) === Number(v))?.label ?? v}
      </span>
    )},
    { key: "dataCriacao", label: "Criado em", render: v => v ? new Date(v).toLocaleString() : "-" },
    { key: "dataAlteracao", label: "Alterado em", render: v => v ? new Date(v).toLocaleString() : "-" },
  ];

  return (
    <>
      <CrudTable
        title="Alocações" icon={<Icon.Rental />} accent="var(--accent3)"
        columns={columns} rows={rows} loading={loading}
        extraActions={[
        { label: "Baixa", icon: <Icon.Check />, variant: "success", onClick: handleBaixa },
        { label: "Cancelar", icon: <Icon.Close />, variant: "danger", onClick: handleCancelar },
        ]}
        onAdd={() => setModal({ open: true, data: {status: 1} })}
        onEdit={row => setModal({ open: true, data: row })}
        onDelete={handleDelete}
      />
      <FormModal
        open={modal.open}
        title={modal.data?.id ? "Editar Alocação" : "Nova Alocação"}
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

export default AlocacoesPage;