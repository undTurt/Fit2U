interface OutfitColorPaletteProps {
  colors: string[];
}

function OutfitColorPalette({ colors }: OutfitColorPaletteProps) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Color Palette:</h3>
      <div className="flex space-x-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: color }}
            title={color}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default OutfitColorPalette;