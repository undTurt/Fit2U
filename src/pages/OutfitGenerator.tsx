import { useState } from 'react';
import { useClosetStore } from '../store/closetStore';
import { useNavigate } from 'react-router-dom';
import OutfitDisplaySection from '../components/outfit/OutfitDisplaySection';

function OutfitGenerator() {
  const { items } = useClosetStore();
  const [generatedOutfit, setGeneratedOutfit] = useState<string[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [outfitCategory, setOutfitCategory] = useState('Generated');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const navigate = useNavigate();

  const getOutfitColors = (itemIds: string[]) => {
    const colors: string[] = [];
    itemIds.forEach(id => {
      const item = items.find(i => i.id === id);
      if (item && item.color && !colors.includes(item.color)) {
        colors.push(item.color);
      }
    });
    return colors;
  };

  const generateOutfit = () => {
    if (items.length === 0) {
      return;
    }

    const categories = {
      hat: items.filter(item => ["hat", "beanie", "cap"].includes(item.category.toLowerCase())),
      undershirt: items.filter(item => ["shirt", "tshirt", "blouse", "top"].includes(item.category.toLowerCase())),
      bottom: items.filter(item => ["pants", "jeans", "skirt", "shorts", "khaki"].includes(item.category.toLowerCase())),
      shoes: items.filter(item => ["shoes", "sneakers", "boots", "sandals"].includes(item.category.toLowerCase())),
      overshirt: items.filter(item => ["jacket", "coat", "cardigan", "flannel", "hoodie", "sweater"].includes(item.category.toLowerCase())),
    };

    const hasBottoms = categories.bottom.length > 0;
    let outfit: string[] = [];

    if (hasBottoms) {
      const randomBottom = categories.bottom[Math.floor(Math.random() * categories.bottom.length)];
      outfit.push(randomBottom.id);
    }

    if (categories.hat.length && Math.random() < 0.3) 
      outfit.push(categories.hat[Math.floor(Math.random() * categories.hat.length)].id);

    if (categories.shoes.length) 
      outfit.push(categories.shoes[Math.floor(Math.random() * categories.shoes.length)].id);

    const hasUndershirt = categories.undershirt.length > 0;
    const hasOvershirt = categories.overshirt.length > 0;

    if (hasUndershirt && hasOvershirt) {
      const includeUndershirt = Math.random() < 0.8;
      const includeOvershirt = Math.random() < 0.6;

      if (!includeUndershirt && !includeOvershirt) {
        outfit.push(categories.undershirt[Math.floor(Math.random() * categories.undershirt.length)].id);
      } else {
        if (includeUndershirt)
          outfit.push(categories.undershirt[Math.floor(Math.random() * categories.undershirt.length)].id);
        if (includeOvershirt)
          outfit.push(categories.overshirt[Math.floor(Math.random() * categories.overshirt.length)].id);
      }
    } else if (hasUndershirt) {
      outfit.push(categories.undershirt[Math.floor(Math.random() * categories.undershirt.length)].id);
    } else if (hasOvershirt) {
      outfit.push(categories.overshirt[Math.floor(Math.random() * categories.overshirt.length)].id);
    }

    const hasRequiredItems = 
      (hasBottoms ? outfit.some(id => categories.bottom.some(item => item.id === id)) : true) &&
      (categories.shoes.length > 0 ? outfit.some(id => categories.shoes.some(item => item.id === id)) : true) &&
      ((hasUndershirt || hasOvershirt) ? 
        (outfit.some(id => categories.undershirt.some(item => item.id === id)) || 
         outfit.some(id => categories.overshirt.some(item => item.id === id))) 
        : true);

    if (!hasRequiredItems) {
      outfit = [];

      if (hasBottoms) {
        outfit.push(categories.bottom[Math.floor(Math.random() * categories.bottom.length)].id);
      }

      if (categories.shoes.length) {
        outfit.push(categories.shoes[Math.floor(Math.random() * categories.shoes.length)].id);
      }

      if (hasUndershirt) {
        outfit.push(categories.undershirt[Math.floor(Math.random() * categories.undershirt.length)].id);
      } else if (hasOvershirt) {
        outfit.push(categories.overshirt[Math.floor(Math.random() * categories.overshirt.length)].id);
      }

      if (outfit.length < 3 && items.length >= 3) {
        const existingIds = new Set(outfit);
        const availableItems = items.filter(item => !existingIds.has(item.id));

        if (availableItems.length > 0) {
          availableItems
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(3 - outfit.length, availableItems.length))
            .forEach(item => outfit.push(item.id));
        }
      }
    }

    if (hasBottoms && !outfit.some(id => categories.bottom.some(item => item.id === id))) {
      outfit.push(categories.bottom[Math.floor(Math.random() * categories.bottom.length)].id);
    }

    if (outfit.length > 5) {
      const bottomId = outfit.find(id => categories.bottom.some(item => item.id === id));
      const shoeId = outfit.find(id => categories.shoes.some(item => item.id === id));
      const shirtId = outfit.find(id => 
        categories.undershirt.some(item => item.id === id) || 
        categories.overshirt.some(item => item.id === id)
      );

      const essentialIds = [bottomId, shoeId, shirtId].filter(Boolean) as string[];
      const otherIds = outfit.filter(id => !essentialIds.includes(id));

      outfit = [...essentialIds, ...otherIds.slice(0, 5 - essentialIds.length)];
    }

    setGeneratedOutfit(outfit);
    setShowSaveForm(false);
  };

  const saveOutfit = () => {
    const savedOutfits = JSON.parse(localStorage.getItem('outfits') || '[]');
    const newOutfit = {
      id: Math.random().toString(36).substr(2, 9),
      name: outfitName || `Outfit ${savedOutfits.length + 1}`,
      category: outfitCategory,
      colors: getOutfitColors(generatedOutfit),
      items: generatedOutfit,
    };

    const updatedOutfits = [...savedOutfits, newOutfit];
    localStorage.setItem('outfits', JSON.stringify(updatedOutfits));

    setOutfitName('');
    setOutfitCategory('Generated');
    setShowSaveForm(false);

    navigate('/outfits?refresh=' + new Date().getTime());
  };

  // Buttons for generating and saving outfits
  const renderActionButtons = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={generateOutfit}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>Generate Outfit</span>
          </button>
        </div>
        
        <div>
          {generatedOutfit.length > 0 && (
            <button
              onClick={() => setShowSaveForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              <span>Save to My Outfits</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 relative" style={{ minHeight: "calc(100vh - 80px)" }}>
      {/* Save outfit form - positioned as a modal overlay at the top */}
      {showSaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-start justify-center pt-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Save Outfit</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Outfit Name"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
                autoFocus
              />
              <input
                type="text"
                placeholder="Category (optional)"
                value={outfitCategory}
                onChange={(e) => setOutfitCategory(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={saveOutfit}
                  disabled={!outfitName}
                  className={`px-4 py-2 rounded-md mr-2 ${
                    outfitName ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSaveForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Outfit Generator</h1>
      
      {/* Action buttons (Generate and Save) */}
      {renderActionButtons()}
      
      {/* Outfit display grid - non-scrolling main content */}
      <div className="outfit-display-container">
        {generatedOutfit.length > 0 ? (
          <OutfitDisplaySection generatedOutfit={generatedOutfit} items={items} />
        ) : (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-gray-500">No outfit generated yet. Click the "Generate Outfit" button to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutfitGenerator;