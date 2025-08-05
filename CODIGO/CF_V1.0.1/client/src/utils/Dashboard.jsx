import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiFileText, FiHome, FiPackage, FiPlusCircle, FiTruck, FiChevronDown, FiChevronUp, FiClipboard, FiList, FiUsers, FiLogOut } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [showMaterialSubmenu, setShowMaterialSubmenu] = useState(false);
  const [showWorkOrderSubmenu, setShowWorkOrderSubmenu] = useState(false);
  const [showClienteSubmenu, setShowClienteSubmenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Cerrar submenús cuando cambia la ruta
  useEffect(() => {
    setShowMaterialSubmenu(false);
    setShowWorkOrderSubmenu(false);
    setShowClienteSubmenu(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 256 }}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gradient-to-b from-black to-gray-900 border-r border-gray-800 shadow-xl flex flex-col relative z-10"
      >
        <div className="p-5 border-b border-gray-800 flex items-center gap-3 overflow-hidden">
          <motion.div
            animate={{ scale: isCollapsed ? 1.2 : 1 }}
            className="text-red-600"
          >
            <FiTruck size={24} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 1 }}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent whitespace-nowrap"
          >
            PintAuto
          </motion.h1>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link
                to="/gestiones"
                className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gradient-to-r hover:from-red-900/50 hover:to-red-800/50 hover:text-white transition-all group"
              >
                <FiHome size={20} className="text-red-500 group-hover:text-white" />
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  className="whitespace-nowrap"
                >
                  Inicio
                </motion.span>
              </Link>
            </li>
            
            {/* Materia Prima */}
            <li>
              <motion.div 
                whileHover={{ backgroundColor: 'rgba(185, 28, 28, 0.5)' }}
                className="flex items-center justify-between p-3 rounded-md text-gray-300 cursor-pointer"
                onClick={() => setShowMaterialSubmenu(!showMaterialSubmenu)}
              >
                <div className="flex items-center gap-3">
                  <FiPackage size={20} className="text-red-500" />
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    className="whitespace-nowrap"
                  >
                    Materia Prima
                  </motion.span>
                </div>
                {!isCollapsed && (
                  showMaterialSubmenu ? 
                    <FiChevronDown size={18} className="text-red-500" /> : 
                    <FiChevronUp size={18} className="text-red-500" />
                )}
              </motion.div>
              
              <AnimatePresence>
                {showMaterialSubmenu && !isCollapsed && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-8 space-y-2"
                  >
                    <li>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 p-2 rounded-md text-gray-300 hover:bg-red-900/50 hover:text-white transition-all text-sm"
                      >
                        <FiList size={16} className="text-red-400" />
                        <span>Listado</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/registrar"
                        className="flex items-center gap-3 p-2 rounded-md text-gray-300 hover:bg-red-900/50 hover:text-white transition-all text-sm"
                      >
                        <FiPlusCircle size={16} className="text-red-400" />
                        <span>Registro</span>
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
            
            {/* Órdenes de Trabajo */}
            <li>
              <motion.div 
                whileHover={{ backgroundColor: 'rgba(185, 28, 28, 0.5)' }}
                className="flex items-center justify-between p-3 rounded-md text-gray-300 cursor-pointer"
                onClick={() => setShowWorkOrderSubmenu(!showWorkOrderSubmenu)}
              >
                <div className="flex items-center gap-3">
                  <FiClipboard size={20} className="text-red-500" />
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    className="whitespace-nowrap"
                  >
                    Órdenes de Trabajo
                  </motion.span>
                </div>
                {!isCollapsed && (
                  showWorkOrderSubmenu ? 
                    <FiChevronDown size={18} className="text-red-500" /> : 
                    <FiChevronUp size={18} className="text-red-500" />
                )}
              </motion.div>
              
              <AnimatePresence>
                {showWorkOrderSubmenu && !isCollapsed && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-8 space-y-2"
                  >
                    <li>
                      <Link
                        to="/dashboard/orden"
                        className="flex items-center gap-3 p-2 rounded-md text-gray-300 hover:bg-red-900/50 hover:text-white transition-all text-sm"
                      >
                        <FiList size={16} className="text-red-400" />
                        <span>Listado</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/crear"
                        className="flex items-center gap-3 p-2 rounded-md text-gray-300 hover:bg-red-900/50 hover:text-white transition-all text-sm"
                      >
                        <FiPlusCircle size={16} className="text-red-400" />
                        <span>Crear Orden</span>
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* Módulo Clientes */}
            <li>
              <motion.div 
                whileHover={{ backgroundColor: 'rgba(185, 28, 28, 0.5)' }}
                className="flex items-center justify-between p-3 rounded-md text-gray-300 cursor-pointer"
                onClick={() => setShowClienteSubmenu(!showClienteSubmenu)}
              >
                <div className="flex items-center gap-3">
                  <FiUsers size={20} className="text-red-500" />
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    className="whitespace-nowrap"
                  >
                    Clientes
                  </motion.span>
                </div>
                {!isCollapsed && (
                  showClienteSubmenu ? 
                    <FiChevronDown size={18} className="text-red-500" /> : 
                    <FiChevronUp size={18} className="text-red-500" />
                )}
              </motion.div>
              
              <AnimatePresence>
                {showClienteSubmenu && !isCollapsed && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-8 space-y-2"
                  >
                    <li>
                      <Link
                        to="/dashboard/cliente"
                        className="flex items-center gap-3 p-2 rounded-md text-gray-300 hover:bg-red-900/50 hover:text-white transition-all text-sm"
                      >
                        <FiList size={16} className="text-red-400" />
                        <span>Listado</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/cliente/registrar"
                        className="flex items-center gap-3 p-2 rounded-md text-gray-300 hover:bg-red-900/50 hover:text-white transition-all text-sm"
                      >
                        <FiPlusCircle size={16} className="text-red-400" />
                        <span>Registro</span>
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* Reportes (enlace simple) */}
            <li>
              <Link
                to="reportes"
                className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-gradient-to-r hover:from-red-900/50 hover:to-red-800/50 hover:text-white transition-all group"
              >
                <FiFileText size={20} className="text-red-500 group-hover:text-white" />
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  className="whitespace-nowrap"
                >
                  Reportes
                </motion.span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botón de colapso y cierre de sesión */}
        <div className="p-4 border-t border-gray-800">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full mb-4 p-2 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-md flex items-center justify-center gap-2"
          >
            {!isCollapsed ? (
              <>
                <span>Colapsar</span>
                <FiChevronDown />
              </>
            ) : (
              <FiChevronUp />
            )}
          </motion.button>
          
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-red-900/50 hover:text-white transition-all"
          >
            <FiLogOut size={20} className="text-red-500" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;