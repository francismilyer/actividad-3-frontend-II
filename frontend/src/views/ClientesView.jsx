import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import { usePagination } from '../hooks/usePagination';
import { MdEdit, MdDelete, MdAdd, MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function ClientesView() {
  const { data: clientes, loading, error, refetch } = useFetch('http://localhost:3000/api/clientes');
  
  const { values, handleChange, resetForm, setForm } = useForm({ nombre: '', telefono: '', email: '' });
  const { isOpen, openModal, closeModal } = useModal();
  const [editingId, setEditingId] = useState(null);

  // Aplicamos la paginación a los datos obtenidos (5 por página)
  const { next, prev, currentData, currentPage, maxPage } = usePagination(clientes || [], 5);

  const handleOpenCreate = () => {
    resetForm();
    setEditingId(null);
    openModal();
  };

  const handleOpenEdit = (cliente) => {
    setForm(cliente);
    setEditingId(cliente.id);
    openModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este cliente? Sus mascotas también serán eliminadas.')) {
      try {
        await fetch(`http://localhost:3000/api/clientes/${id}`, { method: 'DELETE' });
        refetch();
      } catch (err) {
        alert('❌ No se pudo eliminar el cliente.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:3000/api/clientes/${editingId}` : 'http://localhost:3000/api/clientes';
    const method = editingId ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      closeModal();
      refetch();
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  if (loading) return <div className="p-10 text-xl font-bold text-vet-dark">Cargando clientes...</div>;
  if (error) return <div className="p-10 text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-vet-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-vet-dark">Directorio de Clientes</h1>
        <button onClick={handleOpenCreate} className="bg-vet-accent hover:bg-vet-dark text-white px-5 py-3 rounded-xl flex items-center shadow-lg transition-all cursor-pointer">
          <MdAdd className="w-6 h-6 mr-2" /> Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-vet-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-vet-light text-vet-dark">
              <th className="p-4 font-bold">ID</th>
              <th className="p-4 font-bold">Nombre Completo</th>
              <th className="p-4 font-bold">Teléfono</th>
              <th className="p-4 font-bold">Correo Electrónico</th>
              <th className="p-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentData().map(cliente => (
              <tr key={cliente.id} className="border-b border-vet-light hover:bg-vet-white/50">
                <td className="p-4 font-medium text-gray-500">#{cliente.id}</td>
                <td className="p-4 font-bold text-gray-800">{cliente.nombre}</td>
                <td className="p-4 text-gray-600">{cliente.telefono}</td>
                <td className="p-4 text-gray-600">{cliente.email}</td>
                <td className="p-4 flex justify-center space-x-3">
                  <button onClick={() => handleOpenEdit(cliente)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 cursor-pointer"><MdEdit className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(cliente.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 cursor-pointer"><MdDelete className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Controles de Paginación */}
        <div className="flex justify-between items-center p-4 bg-gray-50">
          <span className="text-gray-600 font-medium">Página {currentPage} de {maxPage}</span>
          <div className="flex space-x-2">
            <button onClick={prev} disabled={currentPage === 1} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer"><MdChevronLeft className="w-6 h-6" /></button>
            <button onClick={next} disabled={currentPage === maxPage} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer"><MdChevronRight className="w-6 h-6" /></button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 bg-vet-dark text-white">
              <h2 className="text-2xl font-bold">{editingId ? 'Editar Cliente' : 'Registrar Cliente'}</h2>
              <button onClick={closeModal} className="hover:text-vet-light cursor-pointer"><MdClose className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
                <input required type="text" name="nombre" value={values.nombre} onChange={handleChange} className="w-full p-3 border rounded-xl focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
                <input required type="text" name="telefono" value={values.telefono} onChange={handleChange} className="w-full p-3 border rounded-xl focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Correo Electrónico</label>
                <input required type="email" name="email" value={values.email} onChange={handleChange} className="w-full p-3 border rounded-xl focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer">Cancelar</button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-vet-dark hover:bg-vet-accent rounded-xl cursor-pointer shadow-md">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}