import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logoImage}
                alt="StudyShare Logo"
                className="h-14 w-auto"
              />
              <span className="text-xl font-bold text-teal-600 hidden sm:block">StudyShare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-teal-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-teal-600 transition-colors">
              How it works
            </a>
            <a href="#for-teachers" className="text-gray-700 hover:text-teal-600 transition-colors">
              For Teachers
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-teal-600 transition-colors">
              Free
            </a>
            <a href="#faq" className="text-gray-700 hover:text-teal-600 transition-colors">
              FAQ
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a
              href="#features"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              How it works
            </a>
            <a
              href="#for-teachers"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              For Teachers
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Free
            </a>
            <a
              href="#faq"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              FAQ
            </a>
            <div className="pt-4 space-y-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}