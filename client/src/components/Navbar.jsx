import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pebble">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight text-prince uppercase">Fresha</span>
              <span className="text-2xl font-light text-gray-400">Clone</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-prince transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-prince transition-colors">Testimonials</a>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-prince transition-colors">Log in</Link>
            <Link 
              to="/register" 
              className="px-6 py-2.5 bg-prince text-white rounded-full text-sm font-semibold hover:bg-frank transition-all shadow-lg shadow-prince/20 flex items-center gap-2"
            >
              Sign up <ArrowRight size={16} />
            </Link>
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
        <div className="md:hidden bg-white border-b border-pebble animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-4 text-base font-medium text-gray-600 hover:bg-pebble">Features</a>
            <a href="#testimonials" className="block px-3 py-4 text-base font-medium text-gray-600 hover:bg-pebble">Testimonials</a>
            <Link to="/login" className="block px-3 py-4 text-base font-medium text-gray-600 hover:bg-pebble">Log in</Link>
            <Link to="/register" className="block px-3 py-4 text-base font-medium text-prince font-bold">Sign up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
