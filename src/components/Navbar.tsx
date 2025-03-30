import { Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';

function Navbar() {
  return (
    <header className="bg-[#1C2541] shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <Shirt className="w-8 h-8 text-[#B76D68]" />
          <span className="text-2xl font-bold text-[#B76D68]">Fit2U</span>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/closet" className="text-white hover:text-gray-300 transition">
                My Wardrobe
              </Link>
            </li>
            <li>
              <Link to="/outfits" className="text-white hover:text-gray-300 transition">
                My Outfits
              </Link>
            </li>
            <li>
              <Link to="/outfit-generator" className="text-white hover:text-gray-300 transition">
                Outfit Generator
              </Link>
            </li>
            <li>
              <Link to="/trading" className="text-white hover:text-gray-300 transition">
                Trading
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-white hover:text-gray-300 transition">
                Search
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;