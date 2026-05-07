import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { token } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl tracking-tighter text-lazie-primary font-logo">lazie</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-sm font-medium text-gray-600 hover:text-lazie-dark transition-colors">Features</Link>
            <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-lazie-dark transition-colors">Pricing</Link>
            <Link to="/integrations" className="text-sm font-medium text-gray-600 hover:text-lazie-dark transition-colors">Integrations</Link>
            
            {token ? (
              <Link to="/dashboard" className="px-8 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-lazie-dark transition-colors">Log in</Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-lazie-primary text-gray-950 rounded-full text-sm font-bold hover:brightness-90 transition-all shadow-lg shadow-lazie-primary/20 flex items-center gap-2 uppercase tracking-wide"
                >
                  Sign up <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/features" className="block px-3 py-4 text-base font-medium text-gray-600 hover:bg-gray-50">Features</Link>
            <Link to="/pricing" className="block px-3 py-4 text-base font-medium text-gray-600 hover:bg-gray-50">Pricing</Link>
            <Link to="/integrations" className="block px-3 py-4 text-base font-medium text-gray-600 hover:bg-gray-50">Integrations</Link>
            {token ? (
              <Link to="/dashboard" className="block px-3 py-4 text-base font-bold text-gray-900 bg-gray-50 rounded-xl mt-2">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-4 text-base font-medium text-gray-600 hover:bg-gray-50">Log in</Link>
                <Link to="/register" className="block px-3 py-4 text-base font-bold text-lazie-primary">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
