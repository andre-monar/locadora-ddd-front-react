import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
// ════════════════════════════════════════════════════════════════
//  ALOCAÇÕES PAGE
// ════════════════════════════════════════════════════════════════
const statusOpts = [
  { value: "0", label: "Reservado" },
  { value: "1", label: "Ativo" },
  { value: "2", label: "Devolvido" },
  { value: "3", label: "Cancelado" },
];
const statusColor = { "0": "#6c63ff", "1": "#00d4aa", "2": "#6b7280", "3": "#ff6b6b" };
 
const AlocacoesPage = () => {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, data: null });
  const [toast, setToast]     = useState(null);
 
  useEffect(() => {
    setTimeout(() => {
      setRows([
        { id: 1, idCliente: 1, nomeCliente: "Ana Paula Souza", idCarro: 2, modeloCarro: "Corolla", dataInicio: "2025-04-20", dataDevolucao: "2025-04-25", dataFim: "", status: "1" },
        { id: 2, idCliente: 2, nomeCliente: "Carlos Lima",     idCarro: 1, modeloCarro: "Onix",    dataInicio: "2025-04-18", dataDevolucao: "2025-04-22", dataFim: "2025-04-22", status: "2" },
      ]);
      setLoading(false);
    }, 900);
  }, []);
 
  const fields = [
    { key: "idCliente",    label: "ID do Cliente",  required: true, type: "number" },
    { key: "idCarro",      label: "ID do Carro",  required: true, type: "number" },
    { key: "dataInicio",   label: "Data de Início", required: true, type: "date" },
    { key: "dataDevolucao",label: "Previsão Devolução", required: true, type: "date" },
    { key: "dataFim",      label: "Data Fim Real",  type: "date" },
    { key: "status",       label: "Status",         type: "select", options: statusOpts },
  ];
 
  const columns = [
    { key: "nomeCliente",   label: "Cliente",   primary: true },
    { key: "modeloCarro",   label: "Carro" },
    { key: "dataInicio",    label: "Início" },
    { key: "dataDevolucao", label: "Devolução" },
    { key: "status", label: "Status", render: v => (
      <span style={{ color: statusColor[v] ?? "var(--muted)", fontSize: 12, fontWeight: 600 }}>
        ● {statusOpts.find(o => o.value === String(v))?.label ?? v}
      </span>
    )},
  ];
 
  const handleSave = data => {
    if (data.id) {
      setRows(r => r.map(x => x.id === data.id ? { ...x, ...data } : x));
      setToast({ msg: "Alocação atualizada!", type: "success" });
    } else {
      setRows(r => [...r, { ...data, id: Date.now() }]);
      setToast({ msg: "Alocação criada!", type: "success" });
    }
    setModal({ open: false, data: null });
  };
 
  const handleDelete = row => {
    setRows(r => r.filter(x => x.id !== row.id));
    setToast({ msg: "Alocação excluída.", type: "success" });
  };
 
  return (
    <>
      <CrudTable
        title="Alocações" icon={<Icon.Rental />} accent="var(--accent3)"
        columns={columns} rows={rows} loading={loading}
        onAdd={() => setModal({ open: true, data: null })}
        onEdit={row => setModal({ open: true, data: row })}
        onDelete={handleDelete}
      />
      <FormModal
        open={modal.open}
        title={modal.data?.id ? "Editar Alocação" : "Nova Alocação"}
        fields={fields}
        initialData={modal.data}
        onSave={handleSave}
        onClose={() => setModal({ open: false, data: null })}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default AlocacoesPage;