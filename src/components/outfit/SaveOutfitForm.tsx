interface SaveOutfitFormProps {
  outfitName: string;
  setOutfitName: (name: string) => void;
  onSave: () => void;
  outfitCategory?: string;
  setOutfitCategory?: (category: string) => void;
}

function SaveOutfitForm({ 
  outfitName, 
  setOutfitName, 
  onSave,
  outfitCategory = "",
  setOutfitCategory = () => {}
}: SaveOutfitFormProps) {
  return (
    <div className="mb-8 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-medium mb-4">Save Outfit</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="outfitName" className="block text-sm font-medium text-gray-700 mb-1">
            Outfit Name
          </label>
          <input
            id="outfitName"
            type="text"
            placeholder="Outfit Name"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        {setOutfitCategory && (
          <div>
            <label htmlFor="outfitCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="outfitCategory"
              type="text"
              placeholder="Outfit Category"
              value={outfitCategory}
              onChange={(e) => setOutfitCategory(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        )}
        
        <button
          onClick={onSave}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default SaveOutfitForm;