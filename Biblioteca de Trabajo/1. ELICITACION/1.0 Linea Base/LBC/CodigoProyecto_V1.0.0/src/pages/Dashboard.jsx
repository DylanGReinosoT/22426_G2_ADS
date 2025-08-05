import { Outlet, Link } from 'react-router-dom'
import { FiHome, FiPackage, FiPlusCircle, FiTruck } from 'react-icons/fi'

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-5 border-b flex items-center gap-3">
        <FiTruck size={24} className="text-blue-700" />
          <h1 className="text-2xl font-bold text-blue-700">PintAuto</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/gestiones"
                className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all"
              >
                <FiHome size={20} />
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all"
              >
                <FiPackage size={20} />
                <span>Materia Prima</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/registrar"
                className="flex items-center gap-3 p-3 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all"
              >
                <FiPlusCircle size={20} />
                <span>Registrar Materia</span>
              </Link>
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
