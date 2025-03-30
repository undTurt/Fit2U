import { useState } from 'react';
import { useClosetStore } from '../store/closetStore';

function Trading() {
  const { items } = useClosetStore();
  const [tradeItems, setTradeItems] = useState<string[]>([]);

  const toggleTradeItem = (itemId: string) => {
    setTradeItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Trading</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 border rounded-md cursor-pointer ${
              tradeItems.includes(item.id) ? 'border-green-500' : 'border-gray-300'
            }`}
            onClick={() => toggleTradeItem(item.id)}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h3 className="text-sm font-semibold">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.category}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Items Marked for Trade:</h2>
        <ul className="list-disc pl-5">
          {tradeItems.map((itemId) => {
            const item = items.find((i) => i.id === itemId);
            return item ? <li key={item.id}>{item.name}</li> : null;
          })}
        </ul>
      </div>
    </div>
  );
}

export default Trading;