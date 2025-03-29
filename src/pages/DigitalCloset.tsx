import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, Upload, Pencil, Trash2 } from 'lucide-react';
import { useClosetStore } from '../store/closetStore';

function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Allow cross-origin image loading
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('#FFFFFF'); // Fallback to white if canvas is not supported
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      let rTotal = 0;
      let gTotal = 0;
      let bTotal = 0;
      let pixelCount = 0;

      // Loop through each pixel (4 values per pixel: R, G, B, A)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Only consider fully opaque pixels
        if (alpha > 0) {
          rTotal += r;
          gTotal += g;
          bTotal += b;
          pixelCount++;
        }
      }

      // Calculate the average RGB values
      const rAvg = Math.round(rTotal / pixelCount);
      const gAvg = Math.round(gTotal / pixelCount);
      const bAvg = Math.round(bTotal / pixelCount);

      // Convert the average RGB values to a hex color
      const averageColor = `rgb(${rAvg},${gAvg},${bAvg})`;

      resolve(averageColor);
    };

    img.onerror = () => {
      resolve('#FFFFFF'); // Fallback to white if image loading fails
    };
  });
}

function rgbToHex(rgb: string): string {
  const result = rgb
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map((val) => parseInt(val.trim()).toString(16).padStart(2, '0'))
    .join('');
  return `#${result}`;
}

function hexToRgb(hex: string): string {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r},${g},${b})`;
}

function DigitalCloset() {
  const { items, addItem, removeItem, updateItem } = useClosetStore();
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; category: string; color: string } | null>(null); // Track the item being edited
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    color: '',
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const imageUrl = reader.result as string;

          const dominantColor = await getDominantColor(imageUrl);

          const metadata = {
            name: file.name.split('.')[0],
            category: 'uncategorized',
            color: dominantColor,
            season: [],
            occasion: [],
            imageUrl,
            timesWorn: 0,
          };
          console.log('Metadata:', metadata);

          addItem(metadata);
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

  interface ClosetItem {
    id: string;
    name: string;
    category: string;
    color: string;
    season: string[];
    occasion: string[];
    imageUrl: string;
    timesWorn: number;
  }

  const handleEditClick = (item: ClosetItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      color: item.color,
    });
  };

  interface FormChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleFormChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editingItem) {
      updateItem(editingItem.id, formData);
      setEditingItem(null);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

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
          <div key={item.id} className="rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <div className="flex items-center space-x-2">
                {/* Color square */}
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                {/* Raw RGB values */}
                <p className="text-sm text-gray-600">
                  {item.color.replace('rgb(', '').replace(')', '')}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  onClick={() => handleEditClick(item)}
                >
                  <Pencil className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  {/* Color Picker */}
                  <input
                    type="color"
                    name="color"
                    value={rgbToHex(formData.color)}
                    onChange={(e) => {
                      const hexColor = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        color: hexToRgb(hexColor),
                      }));
                    }}
                    className="w-10 h-10 border-none rounded-md"
                  />
                  {/* RGB Inputs */}
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="red"
                      value={formData.color.match(/\d+/g)?.[0] || 0}
                      onChange={(e) => {
                        const red = parseInt(e.target.value, 10);
                        const [_, g, b] = formData.color.match(/\d+/g) || [0, 0, 0];
                        setFormData((prev) => ({
                          ...prev,
                          color: `rgb(${red},${g},${b})`,
                        }));
                      }}
                      className="w-16 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                      max="255"
                    />
                    <input
                      type="number"
                      name="green"
                      value={formData.color.match(/\d+/g)?.[1] || 0}
                      onChange={(e) => {
                        const green = parseInt(e.target.value, 10);
                        const [r, _, b] = formData.color.match(/\d+/g) || [0, 0, 0];
                        setFormData((prev) => ({
                          ...prev,
                          color: `rgb(${r},${green},${b})`,
                        }));
                      }}
                      className="w-16 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                      max="255"
                    />
                    <input
                      type="number"
                      name="blue"
                      value={formData.color.match(/\d+/g)?.[2] || 0}
                      onChange={(e) => {
                        const blue = parseInt(e.target.value, 10);
                        const [r, g, _] = formData.color.match(/\d+/g) || [0, 0, 0];
                        setFormData((prev) => ({
                          ...prev,
                          color: `rgb(${r},${g},${blue})`,
                        }));
                      }}
                      className="w-16 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                      max="255"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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