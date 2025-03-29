import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus } from 'lucide-react';
import { useClosetStore } from '../store/closetStore';
import ClosetItemCard from '../components/ClosetItemCard';
import SortControls from '../components/SortControls';

function DigitalCloset() {
  const { items, addItem, removeItem } = useClosetStore();
  const [columns, setColumns] = useState(6); // Default to 6 columns

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          addItem({
            name: file.name.split('.')[0],
            category: 'Uncategorized',
            color: '#FFFFFF',
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

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Digital Closet</h1>
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Item</span>
          </button>
        </div>
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

      <SortControls
        sortOption={null}
        selectedSortValue={null}
        setSortOption={() => {}}
        setSelectedSortValue={() => {}}
        categories={[]}
        colors={[]}
      />

      {/* Pass the column count as an inline style */}
      <div
        className="masonry"
        style={{
          columnCount: columns, // Dynamically set columns
        }}
      >
        {items.map((item) => (
          <div key={item.id} className="masonry-item">
            <ClosetItemCard
              item={item}
              onEdit={() => {}}
              onDelete={() => removeItem(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DigitalCloset;