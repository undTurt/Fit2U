import { Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-[#1C2541] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shirt className="w-8 h-8 text-[#B76D68]" />
            <span className="text-xl font-bold text-[#B76D68]">Fit2U</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/closet" className="text-white hover:text-gray-300">
              My Wardrobe
            </Link>
            <Link to="/outfits" className="text-white hover:text-gray-300">
              My Outfits
            </Link>
            <Link to="/outfit-generator" className="text-white hover:text-gray-300">
              Outfit Generator
            </Link>
            <Link to="/trading" className="text-white hover:text-gray-300">
              Trading
            </Link>
            <Link to="/search" className="text-white hover:text-gray-300">
              Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;