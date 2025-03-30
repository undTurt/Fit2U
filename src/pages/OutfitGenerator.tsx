import { useState } from 'react';
import { useClosetStore } from '../store/closetStore';
import { useNavigate } from 'react-router-dom';
import OutfitDisplaySection from '../components/outfit/OutfitDisplaySection';
import WeatherPanel from '../components/weather/WeatherPanel';

function OutfitGenerator() {
  const { items } = useClosetStore();
  const [generatedOutfit, setGeneratedOutfit] = useState<string[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [outfitCategory, setOutfitCategory] = useState('Generated');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showWeatherPanel, setShowWeatherPanel] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<string>('Temperate');
  const [temperature, setTemperature] = useState<number>(0);
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

  const handleWeatherSelect = (condition: string, temp: number) => {
    setWeatherCondition(condition);
    setTemperature(temp);
  };

  const toggleWeatherPanel = () => {
    setShowWeatherPanel(prev => !prev);
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
      overshirt: items.filter(item => [
        "jacket", "coat", "cardigan", "flannel", "hoodie", "sweater", "button-up", "blazer"
      ].includes(item.category.toLowerCase())),
      accessories: items.filter(item => ["bracelet", "chain", "watch"].includes(item.category.toLowerCase())),
    };

    let outfit: string[] = [];

    // Generate outfit based on weather condition
    if (weatherCondition === 'Cold' || weatherCondition === 'Rainy') {
      if (categories.hat.length) {
        outfit.push(categories.hat[Math.floor(Math.random() * categories.hat.length)].id);
      }
      if (categories.undershirt.length) {
        outfit.push(categories.undershirt[Math.floor(Math.random() * categories.undershirt.length)].id);
      }
      if (categories.overshirt.length) {
        outfit.push(categories.overshirt[Math.floor(Math.random() * categories.overshirt.length)].id);
      }
      if (categories.bottom.length) {
        outfit.push(categories.bottom[Math.floor(Math.random() * categories.bottom.length)].id);
      }
    } else if (weatherCondition === 'Hot') {
      if (categories.undershirt.length) {
        outfit.push(categories.undershirt[Math.floor(Math.random() * categories.undershirt.length)].id);
      }
      if (categories.bottom.length) {
        outfit.push(categories.bottom[Math.floor(Math.random() * categories.bottom.length)].id);
      }
    } else if (weatherCondition === 'Temperate') {
      const includeOvershirt = Math.random() > 0.5;
      if (includeOvershirt && categories.overshirt.length) {
        outfit.push(categories.overshirt[Math.floor(Math.random() * categories.overshirt.length)].id);
      } else if (categories.undershirt.length) {
        outfit.push(categories.undershirt[Math.floor(Math.random() * categories.undershirt.length)].id);
      }
      if (categories.bottom.length) {
        outfit.push(categories.bottom[Math.floor(Math.random() * categories.bottom.length)].id);
      }
    }

    if (categories.shoes.length && !outfit.some(id => categories.shoes.find(item => item.id === id))) {
      outfit.push(categories.shoes[Math.floor(Math.random() * categories.shoes.length)].id);
    }

    if (categories.accessories.length) {
      const includeAccessory = Math.random() > 0.5;
      if (includeAccessory) {
        outfit.push(categories.accessories[Math.floor(Math.random() * categories.accessories.length)].id);
      }
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

  const renderActionButtons = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={generateOutfit}
            className="bg-[#1C2541] hover:bg-[#B76D68] text-[#F2EDEB] py-2 px-4 rounded-md shadow flex items-center space-x-2"
          >
            <span>Generate Outfit</span>
          </button>
        </div>
        <div>
          <button
            onClick={toggleWeatherPanel}
            className="bg-[#1C2541] hover:bg-[#B76D68] text-[#F2EDEB] py-2 px-4 rounded-md shadow flex items-center space-x-2"
          >
            <span>ClimateFit</span>
          </button>
        </div>
        <div>
          {generatedOutfit.length > 0 && (
            <button
              onClick={() => setShowSaveForm(true)}
              className="bg-[#1C2541] hover:bg-[#B76D68] text-[#F2EDEB] py-2 px-4 rounded-md shadow flex items-center space-x-2"
            >
              <span>Save to My Outfits</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-[#FFFBE4] min-h-[calc(100vh-4rem)]">
      {showWeatherPanel && (
        <div className="mb-6">
          <WeatherPanel onWeatherSelect={handleWeatherSelect} />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-[#1C2541]">Outfit Generator</h1>

      {renderActionButtons()}

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