import { Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shirt className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">Fit2U</span>
          </Link>
          <Link
            to="/closet"
            className="text-gray-600 hover:text-gray-900"
          >
            Digital Closet
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;