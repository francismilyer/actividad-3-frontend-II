import { useDispatch, useSelector } from 'react-redux';
import { setView } from '../features/uiSlice';
import { MdDashboard, MdPets, MdInventory, MdEvent, MdPeople, MdExitToApp, MdClose } from 'react-icons/md';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const currentView = useSelector(state => state.ui.currentView);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
    { id: 'productos', label: 'Catálogo', icon: MdInventory },
    { id: 'pacientes', label: 'Pacientes', icon: MdPets },
    { id: 'citas', label: 'Citas', icon: MdEvent },
    { id: 'clientes', label: 'Clientes', icon: MdPeople },
  ];

  const handleNavClick = (id) => {
    dispatch(setView(id));
    if (isOpen) toggleSidebar();
  };

  return (
    <>
      {isOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-vet-dark text-vet-white flex flex-col shadow-xl 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:h-screen
      `}>
        <div className="p-6 text-2xl font-black tracking-wider border-b border-vet-white/20 flex justify-between items-center">
          <span>ReactVet</span>
          <button onClick={toggleSidebar} className="md:hidden text-vet-white hover:text-vet-light cursor-pointer">
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                currentView === item.id 
                  ? 'bg-vet-accent text-white shadow-md' 
                  : 'text-vet-light hover:bg-vet-accent/50'
              }`}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-vet-white/10">
          <button 
            onClick={() => handleNavClick('landing')}
            className="w-full flex items-center space-x-3 px-4 py-3 text-vet-light hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <MdExitToApp className="w-6 h-6 shrink-0" />
            <span className="font-semibold">Salir</span>
          </button>
        </div>
      </div>
    </>
  );
}