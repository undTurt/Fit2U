import React from 'react';
import { ClothingItem } from '../../types';

interface OutfitDisplaySectionProps {
  generatedOutfit: string[];
  items: ClothingItem[];
}

const OutfitDisplaySection: React.FC<OutfitDisplaySectionProps> = ({ generatedOutfit, items }) => {
  // Find items by their category
  const findItemByCategory = (categories: string[]): ClothingItem | undefined => {
    return generatedOutfit
      .map(id => items.find(item => item.id === id))
      .find(item => item && categories.includes(item.category.toLowerCase())) || undefined;
  };

  // Get one item from each major category
  const hatItem = findItemByCategory(["hat", "beanie", "cap"]);
  const undershirtItem = findItemByCategory(["shirt", "tshirt", "blouse", "top"]);
  const bottomItem = findItemByCategory(["pants", "jeans", "skirt", "shorts", "khaki"]);
  const shoesItem = findItemByCategory(["shoes", "sneakers", "boots", "sandals"]);
  const overshirtItem = findItemByCategory([
    "jacket", "coat", "cardigan", "flannel", "hoodie", "sweater", "button-up", "blazer"
  ]);
  const accessoryItem = findItemByCategory(["bracelet", "chain", "watch"]); // Find accessory item

  // Render item card
  const renderItemCard = (item: ClothingItem | undefined, label: string) => {
    if (!item) {
      return (
        <div className="bg-gray-100 rounded-lg p-4 h-64 flex flex-col items-center justify-center">
          <p className="text-gray-400">{label} slot empty</p>
        </div>
      );
    }

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden h-64 flex flex-col">
        {item.imageUrl ? (
          <div className="h-44 overflow-hidden">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="h-44 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image</p>
          </div>
        )}
        <div className="p-3 flex-shrink-0">
          <p className="font-medium text-sm mb-1 truncate">{item.name}</p>
          <div className="flex items-center mb-1">
            <span className="text-xs text-gray-600 mr-1">Category:</span>
            <span className="text-xs">{item.category}</span>
          </div>
          {item.color && (
            <div className="flex items-center">
              <span className="text-xs text-gray-600 mr-1">Color:</span>
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}></div>
              <span className="text-xs">{item.color}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-6">
        <div>
          <h3 className="text-md font-medium mb-2">Hat</h3>
          {renderItemCard(hatItem, "Hat")}
        </div>
        <div>
          <h3 className="text-md font-medium mb-2">Undershirt/Top</h3>
          {renderItemCard(undershirtItem, "Undershirt")}
        </div>
        <div>
          <h3 className="text-md font-medium mb-2">Bottom</h3>
          {renderItemCard(bottomItem, "Bottom")}
        </div>
        <div>
          <h3 className="text-md font-medium mb-2">Shoes</h3>
          {renderItemCard(shoesItem, "Shoes")}
        </div>
        <div>
          <h3 className="text-md font-medium mb-2">Overshirt/Jacket</h3>
          {renderItemCard(overshirtItem, "Overshirt")}
        </div>
        <div>
          <h3 className="text-md font-medium mb-2">Accessory</h3>
          {renderItemCard(accessoryItem, "Accessory")} {/* Always render accessory slot */}
        </div>
      </div>
    </div>
  );
};

export default OutfitDisplaySection;