interface SortControlsProps {
  sortOption: 'category' | 'color' | null;
  selectedSortValue: string | null;
  setSortOption: (option: 'category' | 'color' | null) => void;
  setSelectedSortValue: (value: string | null) => void;
  categories: string[];
  colors: string[];
}

function SortControls({
  sortOption,
  selectedSortValue,
  setSortOption,
  setSelectedSortValue,
  categories,
  colors,
}: SortControlsProps) {
  return (
    <div className="flex justify-end mb-4 space-x-4">
      {/* Sorting Option Dropdown */}
      <select
        value={sortOption || ''}
        onChange={(e) => {
          setSortOption(e.target.value as 'category' | 'color');
          setSelectedSortValue(null); // Reset the selected value
        }}
        className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Sort By</option>
        <option value="category">Category</option>
        <option value="color">Color</option>
      </select>

      {/* Sorting Value Dropdown */}
      {sortOption === 'category' && (
        <select
          value={selectedSortValue || ''}
          onChange={(e) => setSelectedSortValue(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}

      {sortOption === 'color' && (
        <select
          value={selectedSortValue || ''}
          onChange={(e) => setSelectedSortValue(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">Select Color</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default SortControls;