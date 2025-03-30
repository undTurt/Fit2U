import { useState } from 'react';
import { useClosetStore } from '../store/closetStore';
import { Plus } from 'lucide-react';

interface Outfit {
  id: string;
  name: string;
  category: string;
  items: string[]; // Array of item IDs
}

function MyOutfits() {
  const { items } = useClosetStore();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [newOutfit, setNewOutfit] = useState<Outfit>({
    id: '',
    name: '',
    category: '',
    items: [],
  });
  const [columns, setColumns] = useState(4); // Default to 4 columns

  const addOutfit = () => {
    if (newOutfit.name && newOutfit.items.length > 0) {
      setOutfits((prev) => [
        ...prev,
        { ...newOutfit, id: Math.random().toString(36).substr(2, 9) },
      ]);
      setNewOutfit({ id: '', name: '', category: '', items: [] });
    }
  };

  const toggleItemInOutfit = (itemId: string) => {
    setNewOutfit((prev) => ({
      ...prev,
      items: prev.items.includes(itemId)
        ? prev.items.filter((id) => id !== itemId)
        : [...prev.items, itemId],
    }));
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">My Outfits</h1>

      {/* Create New Outfit */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create a New Outfit</h2>
        <input
          type="text"
          placeholder="Outfit Name"
          value={newOutfit.name}
          onChange={(e) => setNewOutfit({ ...newOutfit, name: e.target.value })}
          className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Outfit Category"
          value={newOutfit.category}
          onChange={(e) =>
            setNewOutfit({ ...newOutfit, category: e.target.value })
          }
          className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4 w-full"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-md cursor-pointer ${
                newOutfit.items.includes(item.id)
                  ? 'border-blue-500'
                  : 'border-gray-300'
              }`}
              onClick={() => toggleItemInOutfit(item.id)}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 className="text-sm font-semibold">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.category}</p>
            </div>
          ))}
        </div>
        <button
          onClick={addOutfit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Outfit</span>
        </button>
      </div>

      {/* Dropdown to select the number of columns */}
      <div className="flex justify-end mb-4">
        <label htmlFor="columns" className="mr-2 text-sm font-medium text-gray-700">
          Tiles per Row:
        </label>
        <select
          id="columns"
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

      {/* Display Outfits in Masonry Layout */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`, // Dynamically set columns
        }}
      >
        {outfits.map((outfit) => (
          <div key={outfit.id} className="p-4 border rounded-md">
            <h3 className="text-lg font-bold">{outfit.name}</h3>
            <p className="text-sm text-gray-500">{outfit.category}</p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {outfit.items.map((itemId) => {
                const item = items.find((i) => i.id === itemId);
                return (
                  item && (
                    <img
                      key={item.id}
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  )
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOutfits;