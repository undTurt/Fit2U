import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, Upload, Pencil, Trash2 } from 'lucide-react';
import { useClosetStore } from '../store/closetStore';

function DigitalCloset() {
  const { items, addItem, removeItem } = useClosetStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          addItem({
            name: file.name.split('.')[0],
            category: 'uncategorized',
            color: '',
            season: [],
            occasion: [],
            imageUrl: reader.result as string,
            timesWorn: 0,
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [addItem]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
          >
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  onClick={() => {/* TODO: Edit item */}}
                >
                  <Pencil className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            {isDragActive
              ? 'Drop your clothing items here'
              : 'Drag and drop your clothing items here, or click to select files'}
          </p>
        </div>
      )}
    </div>
  );
}

export default DigitalCloset;