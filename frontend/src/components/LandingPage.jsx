import { useDispatch } from 'react-redux';
import { setView } from '../features/uiSlice';

export default function LandingPage() {
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-vet-white flex flex-col justify-center items-center text-center p-6">
      <div className="max-w-3xl w-full bg-vet-light rounded-2xl shadow-xl p-10 border border-vet-dark/20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-vet-dark mb-6 tracking-tight">
          ReactVet
        </h1>
        <p className="text-lg md:text-xl text-gray-800 mb-8 leading-relaxed">
          Bienvenido al sistema integral de administración veterinaria. 
          Gestiona el catálogo de productos, expedientes de pacientes y programación de citas 
          de forma rápida y centralizada.
        </p>
        <button 
          onClick={() => dispatch(setView('dashboard'))}
          className="bg-vet-accent hover:bg-vet-dark text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-lg cursor-pointer"
        >
          Acceder al Catálogo
        </button>
      </div>
    </div>
  );
}