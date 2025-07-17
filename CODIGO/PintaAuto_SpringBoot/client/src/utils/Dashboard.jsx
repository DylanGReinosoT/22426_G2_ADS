import { Outlet, Link } from 'react-router-dom'
import { FiHome, FiPackage, FiPlusCircle, FiTruck, FiChevronDown, FiChevronUp, FiClipboard, FiList, FiUsers } from 'react-icons/fi'
import { useState } from 'react'

const Dashboard = () => {
  const [showMaterialSubmenu, setShowMaterialSubmenu] = useState(false)
  const [showWorkOrderSubmenu, setShowWorkOrderSubmenu] = useState(false)
  const [showClienteSubmenu, setShowClienteSubmenu] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r shadow-sm flex flex-col">
        <div className="p-5 border-b flex items-center gap-3">
          <FiTruck size={24} className="text-red-700" />
          <h1 className="text-2xl font-bold text-red-700">PintAuto</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/gestiones"
                className="flex items-center gap-3 p-3 rounded-md text-white hover:bg-red-700 hover:text-white transition-all"
              >
                <FiHome size={20} />
                <span>Inicio</span>
              </Link>
            </li>
            
            {/* Materia Prima (sin cambios) */}
            <li>
              <div 
                className="flex items-center justify-between p-3 rounded-md text-white hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                onClick={() => setShowMaterialSubmenu(!showMaterialSubmenu)}
              >
                <div className="flex items-center gap-3">
                  <FiPackage size={20} />
                  <span>Materia Prima</span>
                </div>
                {showMaterialSubmenu ? <FiChevronDown size={18} /> : <FiChevronUp size={18} />}
              </div>
              
              {showMaterialSubmenu && (
                <ul className="ml-8 mt-2 space-y-2">
                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 p-2 rounded-md text-white hover:bg-red-700 hover:text-white transition-all text-sm"
                    >
                      <FiList size={16} />
                      <span>Listado</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/registrar"
                      className="flex items-center gap-3 p-2 rounded-md text-white hover:bg-red-700 hover:text-white transition-all text-sm"
                    >
                      <FiPlusCircle size={16} />
                      <span>Registro</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            
            {/* Órdenes de Trabajo (nueva sección) */}
            <li>
              <div 
                className="flex items-center justify-between p-3 rounded-md text-white hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                onClick={() => setShowWorkOrderSubmenu(!showWorkOrderSubmenu)}
              >
                <div className="flex items-center gap-3">
                  <FiClipboard size={20} />
                  <span>Órdenes de Trabajo</span>
                </div>
                {showWorkOrderSubmenu ? <FiChevronDown size={18} /> : <FiChevronUp size={18} />}
              </div>
              
              {showWorkOrderSubmenu && (
                <ul className="ml-8 mt-2 space-y-2">
                  <li>
                    <Link
                      to="/dashboard/orden"
                      className="flex items-center gap-3 p-2 rounded-md text-white hover:bg-red-700 hover:text-white transition-all text-sm"
                    >
                      <FiList size={16} />
                      <span>Listado</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/crear"
                      className="flex items-center gap-3 p-2 rounded-md text-white hover:bg-red-700 hover:text-white transition-all text-sm"
                    >
                      <FiPlusCircle size={16} />
                      <span>Crear Orden</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Modulo Clientes */}
            <li>
              <div 
                className="flex items-center justify-between p-3 rounded-md text-white hover:bg-red-700 hover:text-white transition-all cursor-pointer"
                onClick={() => setShowClienteSubmenu(!showClienteSubmenu)}
              >
                <div className="flex items-center gap-3">
                  <FiUsers size={20} />
                  <span>Clientes</span>
                </div>
                {showClienteSubmenu ? <FiChevronDown size={18} /> : <FiChevronUp size={18} />}
              </div>
              
              {showClienteSubmenu && (
                <ul className="ml-8 mt-2 space-y-2">
                  <li>
                    <Link
                      to="/dashboard/cliente"
                      className="flex items-center gap-3 p-2 rounded-md text-white hover:bg-red-700 hover:text-white transition-all text-sm"
                    >
                      <FiList size={16} />
                      <span>Listado</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/cliente/registrar"
                      className="flex items-center gap-3 p-2 rounded-md text-white hover:bg-red-700 hover:text-white transition-all text-sm"
                    >
                      <FiPlusCircle size={16} />
                      <span>Registro</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard