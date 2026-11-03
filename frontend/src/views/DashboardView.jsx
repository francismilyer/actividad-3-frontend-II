import { useFetch } from '../hooks/useFetch';
import { useToggle } from '../hooks/useToggle';
import { MdVisibility, MdVisibilityOff, MdInventory, MdPets, MdEventAvailable } from 'react-icons/md';

export default function DashboardView() {
  const { data: stats, loading, error } = useFetch('http://localhost:3000/api/dashboard');
  const [showStats, toggleStats] = useToggle(true); // Ocultar/Mostrar métricas

  if (loading) return <div className="p-10 text-xl font-bold text-vet-dark">Cargando métricas...</div>;
  if (error) return <div className="p-10 text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-vet-white min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-vet-dark mb-2">Panel Principal</h1>
          <p className="text-gray-600">Resumen operativo de ReactVet</p>
        </div>
        <button 
          onClick={toggleStats}
          className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          {showStats ? <MdVisibilityOff className="w-5 h-5"/> : <MdVisibility className="w-5 h-5"/>}
          <span className="font-semibold">{showStats ? 'Ocultar Cifras' : 'Mostrar Cifras'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-vet-light flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-700 rounded-xl"><MdInventory className="w-8 h-8" /></div>
          <div>
            <p className="text-gray-500 font-medium">Catálogo</p>
            <h3 className="text-3xl font-bold text-vet-dark">
              {showStats ? `${stats?.totalProductos} prod.` : '****'}
            </h3>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-vet-light flex items-center space-x-4">
          <div className="p-4 bg-green-100 text-green-700 rounded-xl"><MdPets className="w-8 h-8" /></div>
          <div>
            <p className="text-gray-500 font-medium">Pacientes Registrados</p>
            <h3 className="text-3xl font-bold text-vet-dark">
              {showStats ? stats?.totalPacientes : '****'}
            </h3>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-vet-light flex items-center space-x-4">
          <div className="p-4 bg-yellow-100 text-yellow-700 rounded-xl"><MdEventAvailable className="w-8 h-8" /></div>
          <div>
            <p className="text-gray-500 font-medium">Citas Pendientes</p>
            <h3 className="text-3xl font-bold text-vet-dark">
              {showStats ? stats?.citasPendientes : '****'}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}