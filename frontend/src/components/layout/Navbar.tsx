import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg text-sm transition-all ${location.pathname.startsWith(path) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">IS</span>
              </div>
              <span className="text-lg font-bold text-gray-800 hidden sm:block">Inventory</span>
            </Link>
            <div className="hidden md:flex gap-1 ml-4">
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
              <Link to="/products" className={linkClass('/products')}>Productos</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-gray-600">{user?.username}</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-600 transition-colors px-2 py-1"
            >
              Salir
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 pt-3 space-y-1">
            <Link to="/dashboard" className={`block ${linkClass('/dashboard')}`} onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <Link to="/products" className={`block ${linkClass('/products')}`} onClick={() => setMobileOpen(false)}>Productos</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
