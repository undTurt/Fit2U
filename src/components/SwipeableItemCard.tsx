import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface SwipeableItemCardProps {
  item: {
    id: string;
    name: string;
    category: string;
    color: string;
    secondaryColor?: string;
    imageUrl: string;
  };
  onSwipeLeft: (itemId: string) => void;
  onSwipeRight: (itemId: string) => void;
}

const SwipeableItemCard: React.FC<SwipeableItemCardProps> = ({
  item,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [exitX, setExitX] = useState<number>(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setExitX(-window.innerWidth);
      onSwipeLeft(item.id);
    },
    onSwipedRight: () => {
      setExitX(window.innerWidth);
      onSwipeRight(item.id);
    },
    trackMouse: true,
    trackTouch: true,
    delta: 50,
  });

  return (
    <AnimatePresence>
      <motion.div
        {...handlers}
        className="masonry-item bg-white rounded-md overflow-hidden shadow-sm border border-white"
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: exitX }}
        transition={{ duration: 0.3 }}
      >
        <div className="aspect-square bg-white">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
          
          {/* Swipe Direction Indicators */}
          <div
            className={`absolute top-4 left-4 rounded-full p-2 bg-red-500 text-white transition-opacity duration-300 ${
              swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <X size={24} />
          </div>
          <div
            className={`absolute top-4 right-4 rounded-full p-2 bg-green-500 text-white transition-opacity duration-300 ${
              swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Check size={24} />
          </div>
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwipeableItemCard;