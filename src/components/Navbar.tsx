import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function Navbar() {
  const { user, signOut } = useAuthStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shirt className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">Fit2U</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/closet"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Digital Closet
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;