import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import materiaprimaService from '../services/materiaPrimaService';

// Constantes para valores reutilizables
const UNIDADES_MEDIDA = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'L', label: 'Litros (l)' },
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
  const [success, setSuccess] = useState(false);
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
      
      setSuccess(true);
      // Redirección después de un breve delay para feedback visual
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 animate-gradient-x">
      <div className="max-w-2xl mx-auto transform transition-all duration-500 hover:scale-[1.005]">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-red-500/20">
          {/* Encabezado con degradado */}
          <div className="bg-gradient-to-r from-black via-red-900 to-black p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgwLDAsMCwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>
            <h2 className="text-2xl font-bold relative z-10 flex items-center">
              <svg className="w-6 h-6 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Registrar Nueva Materia Prima
            </h2>
            <p className="text-red-200 relative z-10">Complete los detalles del material a registrar</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gray-800/90 backdrop-blur-sm">
            {/* Campo Nombre */}
            <FormField
              label="Nombre de la Materia Prima"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              icon={
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                }
              />
              
              {/* Campo Unidad de Medida */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="unidad">
                  Unidad de Medida
                </label>
                <div className="relative group">
                  <select
                    id="unidad"
                    name="unidad"
                    className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-gray-700 text-white transition-all duration-300 group-hover:border-red-400"
                    value={formData.unidad}
                    onChange={handleChange}
                    required
                  >
                    {UNIDADES_MEDIDA.map((unidad) => (
                      <option key={unidad.value} value={unidad.value} className="bg-gray-800">
                        {unidad.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            
            {/* Campo Detalles */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="detalles">
                Detalles
              </label>
              <div className="relative group">
                <textarea
                  id="detalles"
                  name="detalles"
                  rows="3"
                  className="w-full px-4 py-2 pl-10 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white transition-all duration-300 group-hover:border-red-400"
                  value={formData.detalles}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="Observaciones, especificaciones, etc."
                />
                <div className="absolute top-3 left-3 text-red-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formData.detalles.length}/255 caracteres
                </p>
              </div>
            </div>
            
            {/* Mensaje de error */}
            {error && (
              <div className="animate-pulse p-3 bg-red-900/30 text-red-200 rounded-lg border border-red-700 flex items-start backdrop-blur-sm">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {/* Mensaje de éxito */}
            {success && (
              <div className="animate-bounce-in p-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-emerald-200 rounded-lg border border-emerald-700 flex items-start backdrop-blur-sm">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>¡Materia prima registrada con éxito! Redirigiendo...</span>
              </div>
            )}
            
            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center hover:shadow-md active:scale-95 group hover:border-red-400 hover:text-white"
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5 mr-2 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-black to-red-900 text-white rounded-lg hover:from-black hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-red-500/30 active:scale-95 disabled:opacity-70 group relative overflow-hidden"
                disabled={isSubmitting}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
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
                    <svg className="w-5 h-5 mr-2 text-red-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  <div className="group">
    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor={id}>
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-red-400 group-hover:text-red-300 transition-colors">
          {icon}
        </div>
      )}
      {prefix && (
        <span className="absolute left-10 top-2 text-gray-400 group-hover:text-gray-300 transition-colors">
          {prefix}
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={`w-full ${icon ? 'pl-10' : 'pl-3'} ${prefix ? 'pl-12' : ''} pr-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-gray-700 text-white transition-all duration-300 group-hover:border-red-400`}
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