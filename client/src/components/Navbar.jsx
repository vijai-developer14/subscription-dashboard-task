import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axios'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout') 
    } catch (err) {
      
    }
    logout()           
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/dashboard" className="text-xl font-bold text-blue-600">
            SubsManager
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link to="/plans" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
              Plans
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin/subscriptions" className="text-purple-600 hover:text-purple-800 transition-colors text-sm font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
