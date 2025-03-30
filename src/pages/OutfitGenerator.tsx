import { useState } from 'react';
import { useClosetStore } from '../store/closetStore';
import { useNavigate } from 'react-router-dom';
import OutfitDisplaySection from '../components/outfit/OutfitDisplaySection';
import WeatherPanel from '../components/weather/WeatherPanel';
import SaveOutfitForm from '../components/outfit/SaveOutfitForm';
import ColorFitQuiz from '../components/ColorFitQuiz';

function OutfitGenerator() {
  const { items } = useClosetStore();
  const [generatedOutfit, setGeneratedOutfit] = useState<string[]>([]);
  const [outfitName, setOutfitName] = useState('');
  const [outfitCategory, setOutfitCategory] = useState('Generated');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showWeatherPanel, setShowWeatherPanel] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<string>('Temperate');
  const [temperature, setTemperature] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState(false); // State to toggle quiz visibility
  const [quizResult, setQuizResult] = useState<{ palette: string[]; description: string } | null>(null); // Store quiz result
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

  const toggleQuiz = () => {
    setShowQuiz((prev) => !prev);
  };

  const handleQuizResult = (palette: string[], description: string) => {
    setQuizResult({ palette, description });
    setShowQuiz(false); // Close the quiz after completion
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

    // Helper function to find the best matching item based on the palette
    const findBestMatch = (categoryItems: any[]) => {
        if (!quizResult || !quizResult.palette.length) {
            return categoryItems[Math.floor(Math.random() * categoryItems.length)];
        }

        // Prioritize items that match the palette
        const matchingItems = categoryItems.filter(item =>
            quizResult.palette.some(color => item.color && item.color.toLowerCase() === color.toLowerCase())
        );

        return matchingItems.length > 0
            ? matchingItems[Math.floor(Math.random() * matchingItems.length)]
            : categoryItems[Math.floor(Math.random() * categoryItems.length)];
    };

    // Generate outfit based on weather condition
    if (weatherCondition === 'Cold' || weatherCondition === 'Rainy') {
        if (categories.hat.length) {
            outfit.push(findBestMatch(categories.hat).id);
        }
        if (categories.undershirt.length) {
            outfit.push(findBestMatch(categories.undershirt).id);
        }
        if (categories.overshirt.length) {
            outfit.push(findBestMatch(categories.overshirt).id);
        }
        if (categories.bottom.length) {
            outfit.push(findBestMatch(categories.bottom).id);
        }
    } else if (weatherCondition === 'Hot') {
        if (categories.undershirt.length) {
            outfit.push(findBestMatch(categories.undershirt).id);
        }
        if (categories.bottom.length) {
            outfit.push(findBestMatch(categories.bottom).id);
        }
    } else if (weatherCondition === 'Temperate') {
        // Add hat with 50% probability for temperate weather
        if (categories.hat.length && Math.random() > 0.5) {
            outfit.push(findBestMatch(categories.hat).id);
        }

        const includeOvershirt = Math.random() > 0.5;
        if (includeOvershirt && categories.overshirt.length) {
            outfit.push(findBestMatch(categories.overshirt).id);
        } else if (categories.undershirt.length) {
            outfit.push(findBestMatch(categories.undershirt).id);
        }
        if (categories.bottom.length) {
            outfit.push(findBestMatch(categories.bottom).id);
        }
    }

    if (categories.shoes.length && !outfit.some(id => categories.shoes.find(item => item.id === id))) {
        outfit.push(findBestMatch(categories.shoes).id);
    }

    if (categories.accessories.length) {
        const includeAccessory = Math.random() > 0.5;
        if (includeAccessory) {
            outfit.push(findBestMatch(categories.accessories).id);
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
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white py-2 px-4 rounded-md shadow flex items-center space-x-2"
          >
            <span>Generate Outfit</span>
          </button>
        </div>
        <div>
          <button
            onClick={toggleWeatherPanel}
            className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-teal-500 hover:to-green-400 text-white py-2 px-4 rounded-md shadow flex items-center space-x-2"
          >
            <span>ClimateFit</span>
          </button>
        </div>
        <div>
          <button
            onClick={toggleQuiz}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-500 text-white py-2 px-4 rounded-md shadow flex items-center space-x-2"
          >
            <span>ChromaFit</span>
          </button>
        </div>
        <div>
          {generatedOutfit.length > 0 && (
            <button
              onClick={() => setShowSaveForm(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-yellow-400 text-white py-2 px-4 rounded-md shadow flex items-center space-x-2"
            >
              <span>Save to My Outfits</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-[#FFFFFFF] min-h-[calc(100vh-4rem)]">
      {showWeatherPanel && (
        <div className="mb-6">
          <WeatherPanel onWeatherSelect={handleWeatherSelect} />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-[#1C2541]">Outfit Generator</h1>

      {renderActionButtons()}

      {showQuiz && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <ColorFitQuiz
            onClose={() => setShowQuiz(false)}
            onPaletteGenerated={(palette, description) => handleQuizResult(palette, description)}
          />
        </div>
      )}

      {quizResult && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Your ChromaFit Result</h2>
          <p className="mb-2">{quizResult.description}</p>
          <div className="flex space-x-2">
            {quizResult.palette.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {showSaveForm && (
        <SaveOutfitForm
          outfitName={outfitName}
          setOutfitName={setOutfitName}
          outfitCategory={outfitCategory}
          setOutfitCategory={setOutfitCategory}
          onSave={saveOutfit}
        />
      )}

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