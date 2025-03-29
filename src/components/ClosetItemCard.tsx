import { Pencil, Trash2 } from 'lucide-react';

interface ClosetItemCardProps {
  item: {
    id: string;
    name: string;
    category: string;
    color: string;
    imageUrl: string;
  };
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

function ClosetItemCard({ item, onEdit, onDelete }: ClosetItemCardProps) {
  return (
    <div className="masonry-item">
      <img src={item.imageUrl} alt={item.name} />
      <div className="p-4">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
        <div className="flex items-center space-x-2">
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: item.color }}
          ></div>
        </div>
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
      </div>
    </div>
  );
}

export default ClosetItemCard;