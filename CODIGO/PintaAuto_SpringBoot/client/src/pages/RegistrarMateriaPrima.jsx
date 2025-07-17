import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import materiaprimaService from '../services/materiaPrimaService';

// Constantes para valores reutilizables
const UNIDADES_MEDIDA = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'unidades', label: 'Unidades' }
];

const initialFormState = {
  nombre: '',
  cantidad: '',
  unidad: 'kg',
  precioUnitario: '',
  detalles: ''
};

const RegistrarMateriaPrima = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await materiaprimaService.crear({
        ...formData,
        unidadMedida: formData.unidad,
        fechaIngreso: new Date().toISOString()
      });
      
      // Redirección después de un breve delay para feedback visual
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setError('Error al registrar materia prima. Por favor, intente nuevamente.');
      console.error('Error al registrar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some(value => value !== '' && value !== 'kg')) {
      const confirm = window.confirm('¿Está seguro que desea cancelar? Los datos no guardados se perderán.');
      if (!confirm) return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto transform transition-all duration-300 hover:scale-[1.005]">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
          {/* Encabezado con degradado */}
          <div className="bg-gradient-to-r from-black to-red-400 p-6 text-white">
            <h2 className="text-2xl font-bold">Registrar Nueva Materia Prima</h2>
            <p className="text-blue-100">Complete los detalles del material a registrar</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Campo Nombre */}
            <FormField
              label="Nombre de la Materia Prima"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo Cantidad */}
              <FormField
                label="Cantidad"
                id="cantidad"
                name="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={handleChange}
                required
                min="0"
                step="any"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                }
              />
              
              {/* Campo Unidad de Medida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="unidad">
                  Unidad de Medida
                </label>
                <div className="relative">
                  <select
                    id="unidad"
                    name="unidad"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-colors duration-200"
                    value={formData.unidad}
                    onChange={handleChange}
                    required
                  >
                    {UNIDADES_MEDIDA.map((unidad) => (
                      <option key={unidad.value} value={unidad.value}>
                        {unidad.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Campo Precio Unitario */}
            <FormField
              label="Precio Unitario"
              id="precioUnitario"
              name="precioUnitario"
              type="number"
              value={formData.precioUnitario}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              prefix="$"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            
            {/* Campo Detalles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="detalles">
                Detalles
              </label>
              <div className="relative">
                <textarea
                  id="detalles"
                  name="detalles"
                  rows="3"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.detalles}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="Observaciones, especificaciones, etc."
                />
                <div className="absolute top-3 left-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formData.detalles.length}/255 caracteres
                </p>
              </div>
            </div>
            
            {/* Mensaje de error */}
            {error && (
              <div className="animate-fade-in p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center hover:shadow-md active:scale-95"
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-black to-red-400 text-white rounded-lg hover:from-black hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Registrar Materia Prima
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente reutilizable para campos de formulario
const FormField = ({ label, id, name, type = 'text', value, onChange, required, min, step, prefix, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {icon}
        </div>
      )}
      {prefix && (
        <span className="absolute left-10 top-2 text-gray-500">
          {prefix}
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={`w-full ${icon ? 'pl-10' : 'pl-3'} ${prefix ? 'pl-12' : ''} pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        step={step}
        {...props}
      />
    </div>
  </div>
);

export default RegistrarMateriaPrima;