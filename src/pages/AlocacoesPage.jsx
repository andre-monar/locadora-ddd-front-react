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
 
  // Carrega os status do enum via API
  useEffect(() => {
    fetch('/api/alocacao/status')
      .then(res => res.json())
      .then(data => setStatusOpts(data))
      .catch(() => setStatusOpts([])); // fallback se API falhar
  }, []);

  useEffect(() => {
    // Simulação de dados (mantida)
    setTimeout(() => {
      setRows([
        {
          id: 1, idCliente: 1, nomeCliente: "Ana Paula Souza",
          idCarro: 2, modeloCarro: "Corolla",
          dataRetirada: "2025-04-20", dataPrevistaDevolucao: "2025-04-25",
          dataDevolucao: null, valorTotal: 0.00, status: 1,
          dataCriacao: "2025-04-20T10:30:00", dataAlteracao: null
        },
        {
          id: 2, idCliente: 2, nomeCliente: "Carlos Lima",
          idCarro: 1, modeloCarro: "Onix",
          dataRetirada: "2025-04-18", dataPrevistaDevolucao: "2025-04-22",
          dataDevolucao: "2025-04-22", valorTotal: 250.00, status: 2,
          dataCriacao: "2025-04-18T14:15:00", dataAlteracao: "2025-04-22T17:00:00"
        },
      ]);
      setLoading(false);
    }, 900);
  }, []);
 
  const fields = [
    { key: "idCliente",    label: "ID do Cliente",  required: true, type: "number" },
    { key: "idCarro",      label: "ID do Carro",  required: true, type: "number" },
    { key: "dataInicio",   label: "Data de Início", required: true, type: "date" },
    { key: "dataPrevistaDevolucao",label: "Previsão Devolução", required: true, type: "date" },
    { key: "dataDevolucao",label: "Data Devolução",  type: "date" },
    { key: "status",       label: "Status",         type: "select", options: statusOpts },
  ];
 
  const columns = [
    { key: "id",              label: "ID" },
    { key: "idCliente",       label: "ID Cliente" },
    { key: "nomeCliente",     label: "Cliente",   primary: true },
    { key: "idCarro",         label: "ID Carro" },
    { key: "modeloCarro",     label: "Carro" },
    { key: "dataRetirada",    label: "Retirada" },
    { key: "dataPrevistaDevolucao", label: "Prev. Devolução" },
    { key: "dataDevolucao",   label: "Devolução Real" },
    { key: "valorTotal",      label: "Valor Total", render: v => v != null ? `R$ ${Number(v).toFixed(2)}` : "-" },
    { key: "status", label: "Status", render: v => (
      <span style={{ color: statusColor[v] ?? "var(--muted)", fontSize: 12, fontWeight: 600 }}>
        ● {statusOpts.find(o => o.value === String(v))?.label ?? v}
      </span>
    )},
    { key: "dataCriacao",   label: "Criado em", render: v => v ? new Date(v).toLocaleString() : "-" },
    { key: "dataAlteracao", label: "Alterado em", render: v => v ? new Date(v).toLocaleString() : "-" },
  ];
 
  const handleSave = data => {
    if (data.id) {
      setRows(r => r.map(x => x.id === data.id ? { ...x, ...data } : x));
      setToast({ msg: "Alocação atualizada!", type: "success" });
    } else {
      setRows(r => [...r, { ...data, id: Date.now(), valorTotal: 0, dataCriacao: new Date().toISOString(), dataAlteracao: null }]);
      setToast({ msg: "Alocação criada!", type: "success" });
    }
    setModal({ open: false, data: null });
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