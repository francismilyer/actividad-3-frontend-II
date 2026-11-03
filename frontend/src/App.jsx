import { useSelector } from 'react-redux';
import LandingPage from './components/LandingPage';

function App() {
  const currentView = useSelector((state) => state.ui.currentView);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <div className="p-10 text-vet-dark text-2xl font-bold bg-vet-white min-h-screen">Bienvenido al Dashboard (Sección en construcción)</div>;
      case 'productos':
        return <div>Catálogo de Productos</div>;
      case 'pacientes':
        return <div>Gestión de Pacientes</div>;
      case 'citas':
        return <div>Control de Citas</div>;
      case 'clientes':
        return <div>Directorio de Clientes</div>;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-vet-white font-sans">
      {renderView()}
    </div>
  );
}

export default App;