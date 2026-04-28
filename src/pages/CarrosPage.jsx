import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'
// ════════════════════════════════════════════════════════════════
//  Carros PAGE
// ════════════════════════════════════════════════════════════════
const grupoOpts = [
  { value: "0", label: "Econômico" },
  { value: "1", label: "Intermediário" },
  { value: "2", label: "Executivo" },
  { value: "3", label: "SUV" },
  { value: "4", label: "Premium" },
];
 
const CarrosPage = () => {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, data: null });
  const [toast, setToast]     = useState(null);
 
  useEffect(() => {
    setTimeout(() => {
      setRows([
        { id: 1, modelo: "Onix",    marca: "Chevrolet", placa: "ABC-1234", grupo: "0" },
        { id: 2, modelo: "Corolla", marca: "Toyota",    placa: "XYZ-5678", grupo: "2" },
      ]);
      setLoading(false);
    }, 900);
  }, []);
 
  const fields = [
    { key: "modelo", label: "Modelo", required: true },
    { key: "marca",  label: "Marca",  required: true },
    { key: "placa",  label: "Placa",  required: true, placeholder: "ABC-0000" },
    { key: "grupo",  label: "Grupo",  type: "select", options: grupoOpts },
  ];
 
  const columns = [
    { key: "modelo", label: "Modelo", primary: true },
    { key: "marca",  label: "Marca" },
    { key: "placa",  label: "Placa" },
    { key: "grupo",  label: "Grupo", render: v => grupoOpts.find(o => o.value === String(v))?.label ?? v },
  ];
 
  const handleSave = data => {
    if (data.id) {
      setRows(r => r.map(x => x.id === data.id ? { ...x, ...data } : x));
      setToast({ msg: "Carro atualizado!", type: "success" });
    } else {
      setRows(r => [...r, { ...data, id: Date.now() }]);
      setToast({ msg: "Carro criado!", type: "success" });
    }
    setModal({ open: false, data: null });
  };
 
  const handleDelete = row => {
    setRows(r => r.filter(x => x.id !== row.id));
    setToast({ msg: "Carro excluído.", type: "success" });
  };
 
  return (
    <>
      <CrudTable
        title="Carros" icon={<Icon.Car />} accent="var(--accent2)"
        columns={columns} rows={rows} loading={loading}
        onAdd={() => setModal({ open: true, data: null })}
        onEdit={row => setModal({ open: true, data: row })}
        onDelete={handleDelete}
      />
      <FormModal
        open={modal.open}
        title={modal.data?.id ? "Editar Carro" : "Novo Carro"}
        fields={fields}
        initialData={modal.data}
        onSave={handleSave}
        onClose={() => setModal({ open: false, data: null })}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default CarrosPage;