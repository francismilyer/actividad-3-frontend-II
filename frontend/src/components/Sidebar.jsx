import { useDispatch, useSelector } from 'react-redux';
import { setView } from '../features/uiSlice';
import { MdDashboard, MdPets, MdInventory, MdEvent, MdPeople, MdExitToApp } from 'react-icons/md';

export default function Sidebar() {
  const dispatch = useDispatch();
  const currentView = useSelector(state => state.ui.currentView);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
    { id: 'productos', label: 'Catálogo', icon: MdInventory },
    { id: 'pacientes', label: 'Pacientes', icon: MdPets },
    { id: 'citas', label: 'Citas', icon: MdEvent },
    { id: 'clientes', label: 'Clientes', icon: MdPeople },
  ];

  return (
    <div className="h-screen w-64 bg-vet-dark text-vet-white flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-black tracking-wider border-b border-vet-white/20">
        ReactVet
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => dispatch(setView(item.id))}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id 
                ? 'bg-vet-accent text-white shadow-md' 
                : 'text-vet-light hover:bg-vet-accent/50'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4">
        <button 
          onClick={() => dispatch(setView('landing'))}
          className="w-full flex items-center space-x-3 px-4 py-3 text-vet-light hover:bg-red-500 hover:text-white rounded-xl transition-all"
        >
          <MdExitToApp className="w-6 h-6" />
          <span className="font-semibold">Salir</span>
        </button>
      </div>
    </div>
  );
}