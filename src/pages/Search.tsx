import { useState } from 'react';
import { useClosetStore } from '../store/closetStore';

function Search() {
  const { items } = useClosetStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof items>([]);

  const handleSearch = () => {
    const filteredItems = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredItems);
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-[#FFFFFF] min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold mb-8 text-[#1C2541]">Search</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-[#1C2541] focus:border-[#1C2541] sm:text-sm w-full mb-2"
        />
        <button
          onClick={handleSearch}
          className="bg-[#1C2541] text-[#F2EDEB] px-4 py-2 rounded-md hover:bg-[#B76D68] transition-colors"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((item) => (
          <div key={item.id} className="p-4 border rounded-md bg-white shadow-md">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h3 className="text-sm font-semibold text-[#1C2541]">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;