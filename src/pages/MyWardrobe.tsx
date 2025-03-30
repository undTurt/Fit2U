import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, Trash2, X } from 'lucide-react';
import { useClosetStore } from '../store/closetStore';
import ClosetItemCard from '../components/ClosetItemCard';
import SortControls from '../components/SortControls';
import { ClothingItem as ImportedClothingItem } from '../types/index'; // Updated import path with /index

export interface ClothingItem extends ImportedClothingItem {}

function MyWardrobe() {
  const { items, addItem, removeItem, updateItem, clearWardrobe } = useClosetStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [selectedSortValue, setSelectedSortValue] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    color: '',
    secondaryColor: '',
    season: [] as string[],
    occasion: [] as string[]
  });

  // Handle opening the edit modal
  const handleEdit = (item: ClothingItem) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      color: item.color,
      secondaryColor: item.secondaryColor || '',
      season: item.season || [],
      occasion: item.occasion || []
    });
  };

  // Handle saving edited item
  const handleSaveEdit = () => {
    if (editingItem) {
      updateItem(editingItem.id, {
        ...editingItem,
        name: editForm.name,
        category: editForm.category,
        color: editForm.color,
        secondaryColor: editForm.secondaryColor || undefined,
        season: editForm.season,
        occasion: editForm.occasion
      });
      setEditingItem(null);
    }
  };

  // Handle form field changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Extract unique categories and colors for filtering
  const categories = [...new Set(items.map(item => item.category))];
  const colors = [...new Set(items.map(item => item.color).filter(Boolean))];

  // Function to calculate color distance (using RGB Euclidean distance)
  const getColorDistance = (color1: string, color2: string): number => {
    const parseColor = (color: string): [number, number, number] => {
      const hex = color.startsWith('#') ? color.substring(1) : color;
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16)
      ];
    };

    try {
      const [r1, g1, b1] = parseColor(color1);
      const [r2, g2, b2] = parseColor(color2);

      return Math.sqrt(
        Math.pow(r2 - r1, 2) +
        Math.pow(g2 - g1, 2) +
        Math.pow(b2 - b1, 2)
      );
    } catch (error) {
      return 442; // Maximum possible RGB distance
    }
  };

  // Get the best color match score considering both primary and secondary colors
  const getBestColorMatch = (item: ClothingItem, targetColor: string): number => {
    // Get distance for primary color
    const primaryDistance = getColorDistance(item.color || '#FFFFFF', targetColor);
    
    // If there's a secondary color, check its distance too
    if (item.secondaryColor) {
      const secondaryDistance = getColorDistance(item.secondaryColor, targetColor);
      // Return the smaller distance (better match)
      return Math.min(primaryDistance, secondaryDistance);
    }
    
    // If no secondary color, just return primary distance
    return primaryDistance;
  };

  useEffect(() => {
    let result = [...items];

    if (sortOption === 'category' && selectedSortValue) {
      result = items.filter(item => item.category === selectedSortValue);
    } else if (sortOption === 'color' && selectedSortValue) {
      result = [...items]
        .filter(item => item.color) // Only consider items with a color
        .sort((a, b) => {
          // Consider both primary and secondary colors for sorting
          const matchScoreA = getBestColorMatch(a, selectedSortValue);
          const matchScoreB = getBestColorMatch(b, selectedSortValue);
          
          return matchScoreA - matchScoreB; // Lower distance = better match = should appear first
        });
    } else if (sortOption === 'recent') {
      result = [...items].reverse();
    } else if (sortOption === 'alphabetical') {
      result = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredItems(result);
  }, [items, sortOption, selectedSortValue]);

  const extractMainColors = (imageUrl: string): Promise<string[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const width = img.width;
        const height = img.height;
        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, width, height).data;

          const colorCounts: Record<string, number> = {};

          for (let i = 0; i < imageData.length; i += 20) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            if (a < 128 || (r < 20 && g < 20 && b < 20) || (r > 240 && g > 240 && b > 240)) {
              continue;
            }

            const qr = Math.round(r / 16) * 16;
            const qg = Math.round(g / 16) * 16;
            const qb = Math.round(b / 16) * 16;

            const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1)}`;

            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
          }

          let dominantColors: { color: string; count: number }[] = [];

          for (const color in colorCounts) {
            dominantColors.push({
              color,
              count: colorCounts[color]
            });
          }

          dominantColors.sort((a, b) => b.count - a.count);

          if (dominantColors.length <= 1) {
            return resolve(dominantColors.length ? [dominantColors[0].color] : ['#FFFFFF']);
          }

          const firstColor = dominantColors[0].color;

          const COLOR_DIFFERENCE_THRESHOLD = 100;

          for (let i = 1; i < dominantColors.length; i++) {
            const secondColor = dominantColors[i].color;
            const colorDifference = getColorDistance(firstColor, secondColor);

            const isCommonEnough = dominantColors[i].count > (dominantColors[0].count * 0.25);

            if (colorDifference > COLOR_DIFFERENCE_THRESHOLD && isCommonEnough) {
              return resolve([firstColor, secondColor]);
            }
          }

          resolve([firstColor]);
        } else {
          resolve(['#FFFFFF']);
        }
      };

      img.onerror = () => {
        resolve(['#FFFFFF']);
      };
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const categories = [
        "shirt", "pants", "jeans", "sweater", "shoes",
        "beanie", "cap", "khaki", "sneakers", "hoodie", "flannel",
        "jacket", "coat", "cardigan", "button-up", "blazer",
        "bracelet", "chain", "watch", // Accessories
        "blouse", "skirt", "hat" // Added blouse and skirt
      ];

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const imageUrl = reader.result as string;

          const fileName = file.name.toLowerCase();
          const category =
            categories.find((cat) => fileName.includes(cat)) || "Uncategorized";

          const dominantColors = await extractMainColors(imageUrl);

          addItem({
            name: file.name.split('.')[0],
            category,
            color: dominantColors[0],
            secondaryColor: dominantColors.length > 1 ? dominantColors[1] : undefined,
            season: [],
            occasion: [],
            imageUrl,
            timesWorn: 0,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
  });

  const clearSorting = () => {
    setSortOption(null);
    setSelectedSortValue(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-[#FFFFFF] min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#1C2541]">My Wardrobe</h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowConfirmDialog(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear Wardrobe</span>
          </button>
          
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <button className="bg-[#1C2541] text-[#F2EDEB] px-4 py-2 rounded-md hover:bg-[#B76D68] flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Clear Wardrobe</h3>
            <p className="mb-6">Are you sure you want to delete all items? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  clearWardrobe();
                  setShowConfirmDialog(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Item</h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <img 
                  src={editingItem.imageUrl} 
                  alt={editingItem.name} 
                  className="h-40 object-contain rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="color"
                      value={editForm.color}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <div 
                      className="w-6 h-6 rounded ml-2 border border-gray-300"
                      style={{ backgroundColor: editForm.color }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="secondaryColor"
                      value={editForm.secondaryColor}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    {editForm.secondaryColor && (
                      <div 
                        className="w-6 h-6 rounded ml-2 border border-gray-300"
                        style={{ backgroundColor: editForm.secondaryColor }}
                      ></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-4">
                <button 
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filter & Sort</h2>
          {(sortOption || selectedSortValue) && (
            <button 
              onClick={clearSorting}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        <SortControls
          sortOption={sortOption}
          selectedSortValue={selectedSortValue}
          setSortOption={setSortOption}
          setSelectedSortValue={setSelectedSortValue}
          categories={categories}
          colors={colors}
        />
      </div>

      <div
        className="masonry"
        style={{
          gridTemplateColumns: `repeat(6, 1fr)`,
        }}
      >
        {filteredItems.map((item) => (
          <div key={item.id} className="masonry-item p-2 border border-gray-300 rounded-md">
            <ClosetItemCard
              item={item}
              onEdit={handleEdit}
              onDelete={() => removeItem(item.id)}
            />
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="bg-gray-100 p-8 rounded-md text-center mt-4">
          <p className="text-gray-500">
            {items.length === 0 
              ? "Your wardrobe is empty. Add some clothes to get started!" 
              : "No items match your current filters."}
          </p>
        </div>
      )}
    </div>
  );
}

export default MyWardrobe;