import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import { MdEdit, MdDelete, MdAdd, MdClose, MdPets } from 'react-icons/md';

export default function PacientesView() {
  const { data: pacientes, loading: loadingPacientes, error, refetch } = useFetch('http://localhost:3000/api/pacientes');
  const { data: clientes } = useFetch('http://localhost:3000/api/clientes');
  
  const { values, handleChange, resetForm, setForm } = useForm({ nombre: '', especie: '', raza: '', cliente_id: '' });
  const { isOpen, openModal, closeModal } = useModal();
  const [editingId, setEditingId] = useState(null);

  const handleOpenCreate = () => {
    resetForm();
    setEditingId(null);
    openModal();
  };

  const handleOpenEdit = (paciente) => {
    setForm({
      nombre: paciente.nombre,
      especie: paciente.especie,
      raza: paciente.raza || '',
      cliente_id: paciente.cliente_id
    });
    setEditingId(paciente.id);
    openModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este paciente del expediente?')) {
      try {
        const res = await fetch(`http://localhost:3000/api/pacientes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar');
        refetch();
      } catch (err) {
        alert('❌ No se pudo eliminar el paciente. Puede que tenga citas agendadas.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:3000/api/pacientes/${editingId}` : 'http://localhost:3000/api/pacientes';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const payload = {
        nombre: values.nombre,
        especie: values.especie,
        raza: values.raza,
        cliente_id: parseInt(values.cliente_id, 10)
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

  if (loadingPacientes) return <div className="p-10 text-xl font-bold text-vet-dark">Cargando pacientes...</div>;
  if (error) return <div className="p-10 text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8 bg-vet-white min-h-screen">
      
      {/* Título y Botón con estructura alineada a la izquierda (Responsive) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-vet-light">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-vet-light text-vet-dark rounded-2xl hidden sm:block">
            <MdPets className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-vet-dark">Gestión de Pacientes</h1>
            <p className="text-sm text-gray-500">Administra el expediente clínico de las mascotas</p>
          </div>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="w-full sm:w-auto bg-vet-accent hover:bg-vet-dark text-white px-5 py-3 rounded-xl flex items-center justify-center shadow-lg transition-all cursor-pointer font-bold"
        >
          <MdAdd className="w-6 h-6 mr-2" />
          Registrar Mascota
        </button>
      </div>

      {/* VISTA MÓVIL Y TABLET: Tarjetas (Cards) por objeto con detalles al lado izquierdo/derecho */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {pacientes?.map(pac => (
          <div key={pac.id} className="bg-white p-5 rounded-2xl shadow-sm border border-vet-light flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 bg-vet-light text-vet-dark rounded-md">
                  #PAC-{pac.id.toString().padStart(4, '0')}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">{pac.nombre}</h3>
                <p className="text-sm text-gray-600 font-medium">Especie: <span className="text-gray-800">{pac.especie} {pac.raza && `(${pac.raza})`}</span></p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleOpenEdit(pac)} className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <MdEdit className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(pac.id)} className="p-2 bg-red-100 text-red-700 rounded-xl">
                  <MdDelete className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500">Dueño asignado:</span>
              <span className="font-bold text-vet-dark">{pac.dueno_nombre || 'Sin registrar'}</span>
            </div>
          </div>
        ))}
        {pacientes?.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-vet-light">
            No hay pacientes registrados aún.
          </div>
        )}
      </div>

      {/* VISTA ESCRITORIO: Tabla tradicional optimizada */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-vet-light">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-vet-light text-vet-dark">
              <th className="p-4 font-bold">Expediente</th>
              <th className="p-4 font-bold">Mascota</th>
              <th className="p-4 font-bold">Especie/Raza</th>
              <th className="p-4 font-bold">Dueño</th>
              <th className="p-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes?.map(pac => (
              <tr key={pac.id} className="border-b border-vet-light hover:bg-vet-white/50 transition-colors">
                <td className="p-4 font-medium text-gray-500">#PAC-{pac.id.toString().padStart(4, '0')}</td>
                <td className="p-4 font-bold text-gray-800">{pac.nombre}</td>
                <td className="p-4 text-gray-600">{pac.especie} {pac.raza && `(${pac.raza})`}</td>
                <td className="p-4 text-vet-dark font-medium">{pac.dueno_nombre || 'Sin registrar'}</td>
                <td className="p-4 flex justify-center space-x-3">
                  <button onClick={() => handleOpenEdit(pac)} className="p-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors cursor-pointer">
                    <MdEdit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(pac.id)} className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors cursor-pointer">
                    <MdDelete className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {pacientes?.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No hay pacientes registrados aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Reutilizable */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 bg-vet-dark text-white">
              <h2 className="text-2xl font-bold">{editingId ? 'Editar Expediente' : 'Registrar Mascota'}</h2>
              <button onClick={closeModal} className="hover:text-vet-light transition-colors cursor-pointer">
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nombre de la Mascota</label>
                <input required type="text" name="nombre" value={values.nombre} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Especie</label>
                  <input required type="text" placeholder="Ej: Perro, Gato" name="especie" value={values.especie} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Raza</label>
                  <input type="text" name="raza" value={values.raza} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Dueño (Cliente)</label>
                <select required name="cliente_id" value={values.cliente_id} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent bg-white">
                  <option value="">-- Seleccionar Dueño --</option>
                  {clientes?.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.telefono})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-vet-dark hover:bg-vet-accent rounded-xl transition-colors shadow-md cursor-pointer">
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