import { useState, useEffect } from 'react'
import CrudTable from '../components/CrudTable'
import FormModal from '../components/FormModal'
import Toast from '../components/Toast'
import Icon from '../components/Icon'

const CategoriaCarroPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, data: null });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setRows([
        { id: 1, nome: "Econômico", descricao: "Carros populares", valorDiaria: 120.00, ativo: true },
        { id: 2, nome: "SUV", descricao: "Utilitários esportivos", valorDiaria: 250.00, ativo: true },
      ]);
      setLoading(false);
    }, 900);
  }, []);

  const fields = [
    { key: "nome",        label: "Nome",          required: true },
    { key: "descricao",   label: "Descrição",     type: "textarea" },
    { key: "valorDiaria", label: "Valor da Diária", required: true, type: "number", step: "0.01" },
    { key: "ativo",       label: "Ativo",         type: "select", options: [
        { value: true, label: "Sim" },
        { value: false, label: "Não" }
      ]
    },
  ];

  const columns = [
    { key: "id",          label: "ID" },
    { key: "nome",        label: "Nome",          primary: true },
    { key: "descricao",   label: "Descrição" },
    { key: "valorDiaria", label: "Valor Diária",  render: v => `R$ ${Number(v).toFixed(2)}` },
    { 
        key: "ativo", 
        label: "Ativo",         
        render: v => v 
        ? <span style={{ color: 'var(--accent2)' }}><Icon.Check /></span> 
        : <span style={{ color: 'var(--muted)' }}><Icon.Close /></span>
    },
  ];

  const handleSave = data => {
    const newData = {
      ...data,
      valorDiaria: parseFloat(data.valorDiaria) || 0,
      ativo: data.ativo !== false, // default true
    };
    if (data.id) {
      setRows(r => r.map(x => x.id === data.id ? { ...x, ...newData } : x));
      setToast({ msg: "Categoria atualizada!", type: "success" });
    } else {
      setRows(r => [...r, { ...newData, id: Date.now() }]);
      setToast({ msg: "Categoria criada!", type: "success" });
    }
    setModal({ open: false, data: null });
  };

  const handleDelete = row => {
    setRows(r => r.filter(x => x.id !== row.id));
    setToast({ msg: "Categoria excluída.", type: "success" });
  };

  return (
    <>
      <CrudTable
        title="Categorias de Carro" icon={<Icon.Category />} accent="var(--accent4)"
        columns={columns} rows={rows} loading={loading}
        onAdd={() => setModal({ open: true, data: null })}
        onEdit={row => setModal({ open: true, data: row })}
        onDelete={handleDelete}
      />
      <FormModal
        open={modal.open}
        title={modal.data?.id ? "Editar Categoria" : "Nova Categoria"}
        fields={fields}
        initialData={modal.data}
        onSave={handleSave}
        onClose={() => setModal({ open: false, data: null })}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default CategoriaCarroPage;