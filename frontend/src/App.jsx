import { useSelector } from 'react-redux';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import ProductosView from './views/ProductosView';

function App() {
  const currentView = useSelector((state) => state.ui.currentView);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <div className="p-10 text-vet-dark text-2xl font-bold">Dashboard en construcción...</div>;
      case 'productos':
        return <ProductosView />;
      case 'pacientes':
        return <div className="p-10 text-vet-dark text-2xl font-bold">Gestión de Pacientes</div>;
      case 'citas':
        return <div className="p-10 text-vet-dark text-2xl font-bold">Control de Citas</div>;
      case 'clientes':
        return <div className="p-10 text-vet-dark text-2xl font-bold">Directorio de Clientes</div>;
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