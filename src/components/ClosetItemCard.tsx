import { Pencil, Trash2 } from 'lucide-react';

interface ClosetItemCardProps {
  item: {
    id: string;
    name: string;
    category: string;
    color: string;
    secondaryColor?: string;
    imageUrl: string;
  };
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  hideActions?: boolean;
}

function ClosetItemCard({ item, onEdit, onDelete, hideActions = false }: ClosetItemCardProps) {
  return (
    <div className="masonry-item bg-white rounded-md overflow-hidden shadow-sm border border-white">
      <div className="aspect-square bg-white">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
      </div>
      <div className="p-4 bg-white">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
        <div className="flex items-center space-x-2 mt-2">
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: item.color }}
            title="Primary color"
          ></div>
          {item.secondaryColor && (
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: item.secondaryColor }}
              title="Secondary color"
            ></div>
          )}
        </div>
        {!hideActions && (
          <div className="flex justify-between mt-2">
            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              onClick={() => onEdit(item)}
            >
              <Pencil className="w-4 h-4 text-gray-700" />
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClosetItemCard;