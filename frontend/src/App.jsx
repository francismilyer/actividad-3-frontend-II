import { useSelector } from 'react-redux';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import ProductosView from './views/ProductosView';
import PacientesView from './views/PacientesView';
import CitasView from './views/CitasView';
import ClientesView from './views/ClientesView';
import DashboardView from './views/DashboardView';

function App() {
  const currentView = useSelector((state) => state.ui.currentView);

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
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;