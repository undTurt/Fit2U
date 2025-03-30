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
    onSwiping: (eventData) => {
      const direction = eventData.deltaX > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
    },
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
        className="relative w-full max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        exit={{ x: exitX }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          
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
        
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.category}</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-700 mr-2">Color:</span>
            <div 
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: item.color }}
            ></div>
          </div>
        </div>
        
        <div className="px-4 pb-4 flex justify-between">
          <button 
            onClick={() => {
              setExitX(-window.innerWidth);
              onSwipeLeft(item.id);
            }}
            className="flex-1 mr-2 py-2 bg-red-500 text-white rounded-md flex items-center justify-center"
          >
            <X size={20} className="mr-2" />
            Donate
          </button>
          
          <button 
            onClick={() => {
              setExitX(window.innerWidth);
              onSwipeRight(item.id);
            }}
            className="flex-1 ml-2 py-2 bg-green-500 text-white rounded-md flex items-center justify-center"
          >
            <Check size={20} className="mr-2" />
            Keep
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SwipeableItemCard;