import { useState } from 'react';
import { useClosetStore } from '../store/closetStore';

function OutfitGenerator() {
  const { items } = useClosetStore();
  const [generatedOutfit, setGeneratedOutfit] = useState<string[]>([]);

  const generateOutfit = () => {
    const randomOutfit = items
      .sort(() => 0.5 - Math.random()) // Shuffle items
      .slice(0, 5) // Select up to 5 random items
      .map((item) => item.id);
    setGeneratedOutfit(randomOutfit);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Outfit Generator</h1>
      <button
        onClick={generateOutfit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Generate Outfit
      </button>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {generatedOutfit.map((itemId) => {
          const item = items.find((i) => i.id === itemId);
          return (
            item && (
              <div key={item.id} className="p-4 border rounded-md">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="text-sm font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default OutfitGenerator;