import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import { MdEdit, MdDelete, MdAdd, MdClose, MdEvent } from 'react-icons/md';

export default function CitasView() {
  const { data: citas, loading: loadingCitas, error, refetch } = useFetch('http://localhost:3000/api/citas');
  const { data: pacientes } = useFetch('http://localhost:3000/api/pacientes'); // Traemos los pacientes registrados
  
  const { values, handleChange, resetForm, setForm } = useForm({ paciente_id: '', fecha: '', motivo: '', estado: 'Pendiente' });
  const { isOpen, openModal, closeModal } = useModal();
  const [editingId, setEditingId] = useState(null);

  // Formateador de fecha para el input type="datetime-local"
  const formatForInput = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const handleOpenCreate = () => {
    resetForm();
    setForm(prev => ({ ...prev, estado: 'Pendiente' }));
    setEditingId(null);
    openModal();
  };

  const handleOpenEdit = (cita) => {
    setForm({
      paciente_id: cita.paciente_id,
      fecha: formatForInput(cita.fecha),
      motivo: cita.motivo,
      estado: cita.estado
    });
    setEditingId(cita.id);
    openModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Cancelar y eliminar esta cita de la agenda?')) {
      try {
        const res = await fetch(`http://localhost:3000/api/citas/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar la cita');
        refetch();
      } catch (err) {
        alert('❌ No se pudo cancelar la cita.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:3000/api/citas/${editingId}` : 'http://localhost:3000/api/citas';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const payload = {
        paciente_id: parseInt(values.paciente_id, 10),
        fecha: values.fecha,
        motivo: values.motivo,
        estado: values.estado
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

  if (loadingCitas) return <div className="p-10 text-xl font-bold text-vet-dark">Cargando agenda...</div>;
  if (error) return <div className="p-10 text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8 bg-vet-white min-h-screen">
      
      {/* Título y Botón alineados a la izquierda y adaptables */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-vet-light">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-vet-light text-vet-dark rounded-2xl hidden sm:block">
            <MdEvent className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-vet-dark">Control de Citas</h1>
            <p className="text-sm text-gray-500">Administra la programación y turnos de la veterinaria</p>
          </div>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="w-full sm:w-auto bg-vet-accent hover:bg-vet-dark text-white px-5 py-3 rounded-xl flex items-center justify-center shadow-lg transition-all cursor-pointer font-bold"
        >
          <MdAdd className="w-6 h-6 mr-2" />
          Agendar Cita
        </button>
      </div>

      {/* VISTA MÓVIL Y TABLET: Tarjetas (Cards) flexibles con detalles organizados al lado */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {citas?.map(cita => (
          <div key={cita.id} className="bg-white p-5 rounded-2xl shadow-sm border border-vet-light flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 bg-vet-light text-vet-dark rounded-md">
                  #{cita.id.toString().padStart(4, '0')}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-2">{cita.paciente_nombre || 'Desconocido'}</h3>
                <p className="text-sm text-gray-600 font-medium">Motivo: <span className="text-gray-800">{cita.motivo}</span></p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleOpenEdit(cita)} className="p-2 bg-blue-100 text-blue-700 rounded-xl cursor-pointer">
                  <MdEdit className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(cita.id)} className="p-2 bg-red-100 text-red-700 rounded-xl cursor-pointer">
                  <MdDelete className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500">
                {new Date(cita.fecha).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                cita.estado === 'Completada' ? 'bg-green-100 text-green-700' :
                cita.estado === 'Cancelada' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {cita.estado}
              </span>
            </div>
          </div>
        ))}
        {citas?.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-vet-light">
            No hay citas programadas en la agenda.
          </div>
        )}
      </div>

      {/* VISTA ESCRITORIO: Tabla tradicional optimizada */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-vet-light">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-vet-light text-vet-dark">
              <th className="p-4 font-bold">Turno</th>
              <th className="p-4 font-bold">Fecha y Hora</th>
              <th className="p-4 font-bold">Paciente</th>
              <th className="p-4 font-bold">Motivo</th>
              <th className="p-4 font-bold">Estado</th>
              <th className="p-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas?.map(cita => (
              <tr key={cita.id} className="border-b border-vet-light hover:bg-vet-white/50 transition-colors">
                <td className="p-4 font-medium text-gray-500">#{cita.id.toString().padStart(4, '0')}</td>
                <td className="p-4 font-bold text-gray-800">
                  {new Date(cita.fecha).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td className="p-4 text-vet-dark font-medium">{cita.paciente_nombre || 'Desconocido'}</td>
                <td className="p-4 text-gray-600">{cita.motivo}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    cita.estado === 'Completada' ? 'bg-green-100 text-green-700' :
                    cita.estado === 'Cancelada' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {cita.estado}
                  </span>
                </td>
                <td className="p-4 flex justify-center space-x-3">
                  <button onClick={() => handleOpenEdit(cita)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer">
                    <MdEdit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(cita.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer">
                    <MdDelete className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {citas?.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No hay citas programadas en la agenda.</td>
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
              <h2 className="text-2xl font-bold">{editingId ? 'Reprogramar Cita' : 'Agendar Cita'}</h2>
              <button onClick={closeModal} className="hover:text-vet-light transition-colors cursor-pointer">
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Paciente (Mascota)</label>
                <select required name="paciente_id" value={values.paciente_id} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent bg-white">
                  <option value="">-- Seleccionar Paciente --</option>
                  {pacientes?.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} ({p.especie}) - Dueño: {p.dueno_nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Fecha y Hora</label>
                <input required type="datetime-local" name="fecha" value={values.fecha} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent" />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Motivo de Consulta</label>
                <textarea required rows="2" name="motivo" placeholder="Ej: Vacunación anual, Consulta general..." value={values.motivo} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent resize-none"></textarea>
              </div>

              {editingId && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Estado de la Cita</label>
                  <select required name="estado" value={values.estado} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-vet-accent focus:ring-1 focus:ring-vet-accent bg-white">
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-vet-dark hover:bg-vet-accent rounded-xl transition-colors shadow-md cursor-pointer">
                  {editingId ? 'Guardar Cambios' : 'Confirmar Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}