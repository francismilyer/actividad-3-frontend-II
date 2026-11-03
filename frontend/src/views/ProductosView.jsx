import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import { MdEdit, MdDelete, MdAdd, MdClose } from 'react-icons/md';

export default function ProductosView() {
  const { data: productos, loading, error, refetch } = useFetch('http://localhost:3000/api/productos');
  const { values, handleChange, resetForm, setForm } = useForm({ nombre: '', categoria: '', precio: '', stock: '' });
  const { isOpen, openModal, closeModal } = useModal();
  const [editingId, setEditingId] = useState(null);

  const handleOpenCreate = () => {
    resetForm();
    setEditingId(null);
    openModal();
  };

  const handleOpenEdit = (producto) => {
    setForm(producto);
    setEditingId(producto.id);
    openModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este producto del catálogo?')) {
      try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar');
        refetch();
      } catch (err) {
        alert('❌ No se pudo eliminar el producto.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:3000/api/productos/${editingId}` : 'http://localhost:3000/api/productos';
    const method = editingId ? 'PUT' : 'POST';

    try {
      // Forzamos la conversión a números para evitar errores de tipo en MariaDB
      const payload = {
        nombre: values.nombre,
        categoria: values.categoria,
        precio: parseFloat(values.precio),
        stock: parseInt(values.stock, 10)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error guardando en base de datos');
      
      closeModal();
      refetch();
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  if (loading) return <div className="p-10 text-xl font-bold text-vet-dark">Cargando catálogo...</div>;
  if (error) return <div className="p-10 text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-vet-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-vet-dark">Catálogo de Productos</h1>
        <button 
          onClick={handleOpenCreate}
          className="bg-vet-accent hover:bg-vet-dark text-white px-5 py-3 rounded-xl flex items-center shadow-lg transition-all"
        >
          <MdAdd className="w-6 h-6 mr-2" />
          Nuevo Producto
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-vet-light">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-vet-light text-vet-dark">
              <th className="p-4 font-bold">ID</th>
              <th className="p-4 font-bold">Nombre</th>
              <th className="p-4 font-bold">Categoría</th>
              <th className="p-4 font-bold">Precio (USD)</th>
              <th className="p-4 font-bold">Stock</th>
              <th className="p-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos?.map(prod => (
              <tr key={prod.id} className="border-b border-vet-light hover:bg-vet-white/50 transition-colors">
                <td className="p-4 font-medium text-gray-500">{prod.id}</td>
                <td className="p-4 font-bold text-gray-800">{prod.nombre}</td>
                <td className="p-4 text-gray-600">{prod.categoria}</td>
                <td className="p-4 text-green-700 font-bold">${Number(prod.precio).toFixed(2)}</td>
                <td className="p-4 text-gray-600">{prod.stock} un.</td>
                <td className="p-4 flex justify-center space-x-3">
                  <button onClick={() => handleOpenEdit(prod)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    <MdEdit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(prod.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <MdDelete className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 bg-vet-dark text-white">
              <h2 className="text-2xl font-bold">{editingId ? 'Editar Producto' : 'Registrar Producto'}</h2>
              <button onClick={closeModal} className="hover:text-vet-light transition-colors">
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nombre del Producto</label>
                <input required type="text" name="nombre" value={values.nombre} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
                <input required type="text" name="categoria" value={values.categoria} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Precio (USD)</label>
                  <input required type="number" step="0.01" name="precio" value={values.precio} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Stock Inicial</label>
                  <input required type="number" name="stock" value={values.stock} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-vet-dark hover:bg-vet-accent rounded-xl transition-colors shadow-md">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}