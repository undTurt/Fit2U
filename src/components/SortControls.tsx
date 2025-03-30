import React from 'react';

interface SortControlsProps {
  sortOption: string | null;
  selectedSortValue: string | null;
  setSortOption: (option: string | null) => void;
  setSelectedSortValue: (value: string | null) => void;
  categories: string[];
  colors: string[];
}

// Define main color options with their hex values
const mainColors = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Green', value: '#008000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Purple', value: '#800080' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' }
];

const SortControls: React.FC<SortControlsProps> = ({
  sortOption,
  selectedSortValue,
  setSortOption,
  setSelectedSortValue,
  categories,
  colors,
}) => {
  // Handle sort option change
  const handleSortOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value || null);
    setSelectedSortValue(null); // Reset value when option changes
  };

  // Handle sort value change
  const handleSortValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSortValue(e.target.value || null);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Sort option dropdown */}
      <div className="w-full sm:w-auto">
        <label htmlFor="sortOption" className="block text-sm font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          id="sortOption"
          value={sortOption || ''}
          onChange={handleSortOptionChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select an option</option>
          <option value="category">Category</option>
          <option value="color">Color</option>
          <option value="recent">Most Recent</option>
          <option value="alphabetical">Alphabetical (A-Z)</option>
        </select>
      </div>

      {/* Conditional second dropdown based on first selection */}
      {sortOption === 'category' && (
        <div className="w-full sm:w-auto">
          <label htmlFor="categoryValue" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="categoryValue"
            value={selectedSortValue || ''}
            onChange={handleSortValueChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {sortOption === 'color' && (
        <div className="w-full sm:w-auto">
          <label htmlFor="colorValue" className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex items-center">
            <select
              id="colorValue"
              value={selectedSortValue || ''}
              onChange={handleSortValueChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Colors</option>
              {mainColors.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.name}
                </option>
              ))}
            </select>
            
            {selectedSortValue && (
              <div 
                className="w-6 h-6 rounded-full ml-2 border border-gray-300"
                style={{ backgroundColor: selectedSortValue }}
              ></div>
            )}
          </div>
          {sortOption === 'color' && selectedSortValue && (
            <p className="text-xs text-gray-500 mt-1">
              Items are sorted by closest match to this color (including secondary colors)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SortControls;