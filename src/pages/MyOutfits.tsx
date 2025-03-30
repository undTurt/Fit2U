import { useState, useEffect, useRef } from 'react';
import { useClosetStore } from '../store/closetStore';
import ClosetItemCard from '../components/ClosetItemCard';
import { Plus, Trash2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function MyOutfits() {
  const { items } = useClosetStore();
  const [columns, setColumns] = useState(6);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [outfits, setOutfits] = useState<
    { id: string; name: string; category: string; colors: string[]; items: string[] }[]
  >([]);
  const [newOutfit, setNewOutfit] = useState({
    name: '',
    category: '',
    colors: [] as string[],
  });
  
  // Use a ref to track whether we've loaded from localStorage
  const hasLoadedFromStorage = useRef(false);
  // Use a ref to track if this is an internal state update vs external event
  const isInternalUpdate = useRef(false);
  
  // Use location to detect when we navigate to this page
  const location = useLocation();

  // ONLY load from localStorage on mount and when navigating
  useEffect(() => {
    try {
      console.log('MyOutfits: Loading from localStorage');
      const savedOutfitsJSON = localStorage.getItem('outfits');
      
      if (savedOutfitsJSON) {
        const savedOutfits = JSON.parse(savedOutfitsJSON);
        console.log('MyOutfits: Found outfits in localStorage:', savedOutfits.length);
        
        // Set the flag BEFORE updating state to prevent write-back
        isInternalUpdate.current = true;
        setOutfits(savedOutfits);
      } else {
        console.log('MyOutfits: No outfits found in localStorage');
      }
      
      // Mark that we've loaded from storage
      hasLoadedFromStorage.current = true;
      
    } catch (error) {
      console.error('Error loading outfits from localStorage:', error);
    }
  }, [location.search]); // Only run when location search changes

  // ONLY save to localStorage when outfits change AND it's not from loading
  useEffect(() => {
    // Skip if we haven't loaded from storage yet
    if (!hasLoadedFromStorage.current) {
      return;
    }
    
    // Skip if this was an internal update from loading
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false; // Reset for next change
      return;
    }
    
    // Only save if it's a real user change
    console.log('MyOutfits: Saving outfits to localStorage:', outfits.length);
    localStorage.setItem('outfits', JSON.stringify(outfits));
  }, [outfits]);

  const toggleItemSelection = (itemId: string, itemColor: string) => {
    const isDeselecting = selectedItems.includes(itemId);
    
    setSelectedItems((prev) =>
      isDeselecting
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );

    if (isDeselecting) {
      setNewOutfit((prev) => {
        const remainingSelectedItems = selectedItems.filter(id => id !== itemId);
        const otherItemWithSameColor = items.some(item => 
          remainingSelectedItems.includes(item.id) && item.color === itemColor
        );
        return {
          ...prev,
          colors: otherItemWithSameColor 
            ? prev.colors 
            : prev.colors.filter(color => color !== itemColor)
        };
      });
    } else {
      setNewOutfit((prev) => ({
        ...prev,
        colors: prev.colors.includes(itemColor)
          ? prev.colors
          : [...prev.colors, itemColor],
      }));
    }
  };

  const createOutfit = () => {
    if (newOutfit.name && newOutfit.category && selectedItems.length > 0) {
      const newOutfitObj = {
        id: Math.random().toString(36).substr(2, 9),
        name: newOutfit.name,
        category: newOutfit.category,
        colors: newOutfit.colors,
        items: selectedItems,
      };
      
      setOutfits((prev) => [...prev, newOutfitObj]);
      setNewOutfit({ name: '', category: '', colors: [] });
      setSelectedItems([]);
    }
  };

  const deleteOutfit = (outfitId: string) => {
    setOutfits((prev) => prev.filter((outfit) => outfit.id !== outfitId));
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-[#FFFFFF] min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1C2541]">My Outfits</h1>
      </div>

      <div className="mb-8 p-4 border rounded-md bg-gray-50">
        <h2 className="text-xl font-semibold mb-4 text-[#1C2541]">Create a New Outfit</h2>
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Outfit Name"
            value={newOutfit.name}
            onChange={(e) => setNewOutfit({ ...newOutfit, name: e.target.value })}
            className="border-gray-300 rounded-md shadow-sm focus:ring-[#1C2541] focus:border-[#1C2541] sm:text-sm w-full sm:w-64"
          />
          <input
            type="text"
            placeholder="Outfit Category"
            value={newOutfit.category}
            onChange={(e) =>
              setNewOutfit({ ...newOutfit, category: e.target.value })
            }
            className="border-gray-300 rounded-md shadow-sm focus:ring-[#1C2541] focus:border-[#1C2541] sm:text-sm w-full sm:w-64"
          />
          <button
            onClick={createOutfit}
            className="bg-[#1C2541] text-[#F2EDEB] px-4 py-2 rounded-md hover:bg-[#B76D68] flex items-center space-x-2 mt-2 sm:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>Create Outfit</span>
          </button>
        </div>
        
        {newOutfit.colors.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-700 mb-2">Color Palette:</p>
            <div className="flex space-x-2">
              {newOutfit.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-700 mt-3">
          {selectedItems.length === 0 
            ? "Click on items below to add them to your outfit" 
            : `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} selected`}
        </p>
      </div>

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

      <div
        className="masonry"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`masonry-item p-2 cursor-pointer transition-colors duration-200 ${
              selectedItems.includes(item.id) 
                ? 'bg-blue-100 border-2 border-blue-500 rounded-md' 
                : 'border border-gray-300 rounded-md'
            }`}
            onClick={() => toggleItemSelection(item.id, item.color)}
          >
            <ClosetItemCard
              item={item}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">My Outfits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {outfits.map((outfit) => (
            <div key={outfit.id} className="bg-white p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow relative">
              <button 
                onClick={() => deleteOutfit(outfit.id)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
              
              <h3 className="text-lg font-bold">{outfit.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{outfit.category}</p>
              
              {/* Color palette */}
              <div className="flex flex-wrap gap-1 mb-3">
                {outfit.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              
              {/* Outfit items grid - maintain aspect ratio without cropping */}
              <div className="grid grid-cols-3 gap-2">
                {outfit.items.map((itemId) => {
                  const item = items.find((i) => i.id === itemId);
                  return item ? (
                    <div key={item.id} className="aspect-square relative bg-gray-50 rounded overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain" // object-contain instead of object-cover
                        title={item.name}
                      />
                    </div>
                  ) : (
                    <div 
                      key={itemId} 
                      className="aspect-square bg-gray-200 rounded-md flex items-center justify-center"
                    >
                      <span className="text-xs text-gray-500">Item not found</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {outfits.length === 0 && (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">No outfits created yet. Create your first outfit above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOutfits;