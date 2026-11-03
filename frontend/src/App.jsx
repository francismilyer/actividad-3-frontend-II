import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MdMenu } from 'react-icons/md';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import ProductosView from './views/ProductosView';
import PacientesView from './views/PacientesView';
import CitasView from './views/CitasView';
import ClientesView from './views/ClientesView';
import DashboardView from './views/DashboardView';

function App() {
  const currentView = useSelector((state) => state.ui.currentView);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'productos':
        return <ProductosView />;
      case 'pacientes':
        return <PacientesView />;
      case 'citas':
        return <CitasView />;
      case 'clientes':
        return <ClientesView />;
      default:
        return <LandingPage />;
    }
  };

  if (currentView === 'landing') return <LandingPage />;

  return (
    <div className="flex h-screen bg-vet-white font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-vet-dark text-vet-white p-4 flex items-center md:hidden shadow-md shrink-0">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg hover:bg-vet-accent/50 transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            <MdMenu className="w-7 h-7" />
          </button>
          <span className="ml-4 text-xl font-bold tracking-wider">ReactVet Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;