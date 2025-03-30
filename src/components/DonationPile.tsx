import React, { useState } from 'react';
import { Undo } from 'lucide-react';

interface DonationPileProps {
  items: Array<{
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    color?: string;
  }>;
  onRestore: (itemId: string) => void;
}

const DonationPile: React.FC<DonationPileProps> = ({ items, onRestore }) => {
  const [columns, setColumns] = useState(6); // Default to 6 columns like other pages
  
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">Your donation pile is empty</p>
      </div>
    );
  }

  return (
    <>
      {/* Column selector - matching MyOutfits and MyWardrobe */}
      <div className="flex justify-end mb-4">
        <label htmlFor="donation-columns" className="mr-2 text-sm font-medium text-gray-700">
          Tiles per Row:
        </label>
        <select
          id="donation-columns"
          value={columns}
          onChange={(e) => setColumns(Number(e.target.value))}
          className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {[2, 3, 4, 5, 6, 7, 8].map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Masonry layout matching other pages */}
      <div
        className="masonry"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {items.map((item) => (
          <div key={item.id} className="masonry-item p-2 border border-gray-300 rounded-md relative">
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full object-cover rounded-md"
              />
              <button
                onClick={() => onRestore(item.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                aria-label="Restore item"
              >
                <Undo size={18} className="text-blue-500" />
              </button>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.category}</p>
              
              {/* Display color if available */}
              {item.color && (
                <div className="flex items-center mt-2">
                  <span className="text-xs text-gray-700 mr-2">Color:</span>
                  <div 
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: item.color }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DonationPile;