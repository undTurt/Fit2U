import { useState, useEffect, useRef } from 'react';
import { useClosetStore } from '../store/closetStore';
import SwipeableItemCard from '../components/SwipeableItemCard';
import DonationPile from '../components/DonationPile';
import { X, Check, Undo } from 'lucide-react';

function Trading() {
  const { items } = useClosetStore();
  const [donationPile, setDonationPile] = useState<string[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showDonationPile, setShowDonationPile] = useState(false);
  const [activeItems, setActiveItems] = useState<typeof items>([]);
  
  // Use refs to track whether we've loaded from localStorage
  const hasLoadedFromStorage = useRef(false);
  // Use a ref to track if this is an internal state update vs external event
  const isInternalUpdate = useRef(false);

  // Filter out items that are in the donation pile
  useEffect(() => {
    setActiveItems(items.filter(item => !donationPile.includes(item.id)));
  }, [items, donationPile]);

  // Load donation pile from localStorage on mount
  useEffect(() => {
    try {
      console.log('Trading: Loading donation pile from localStorage');
      const savedDonationPileJSON = localStorage.getItem('donationPile');
      
      if (savedDonationPileJSON) {
        const savedDonationPile = JSON.parse(savedDonationPileJSON);
        console.log('Trading: Found donation pile in localStorage:', savedDonationPile.length);
        
        // Set the flag BEFORE updating state to prevent write-back
        isInternalUpdate.current = true;
        setDonationPile(savedDonationPile);
      } else {
        console.log('Trading: No donation pile found in localStorage');
      }
      
      // Mark that we've loaded from storage
      hasLoadedFromStorage.current = true;
      
    } catch (error) {
      console.error('Error loading donation pile from localStorage:', error);
    }
  }, []);

  // Save donation pile to localStorage when it changes
  useEffect(() => {
    // Skip if we haven't loaded from storage yet
    if (!hasLoadedFromStorage.current) {
      return;
    }
    
    // Skip if this was an internal update from loading
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false; // Reset for next change
      return;
    }
    
    // Only save if it's a real user change
    console.log('Trading: Saving donation pile to localStorage:', donationPile.length);
    localStorage.setItem('donationPile', JSON.stringify(donationPile));
  }, [donationPile]);

  const handleDonate = (itemId: string) => {
    setDonationPile(prev => [...prev, itemId]);
    moveToNextItem();
  };

  const handleKeep = () => {
    moveToNextItem();
  };

  const moveToNextItem = () => {
    if (currentItemIndex < activeItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    }
  };

  const handleRestoreItem = (itemId: string) => {
    setDonationPile(prev => prev.filter(id => id !== itemId));
  };

  const donatedItems = items.filter(item => donationPile.includes(item.id));

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Donation Center</h1>
        <button
          onClick={() => setShowDonationPile(!showDonationPile)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {showDonationPile ? 'Back to Donation' : `Donation Pile (${donationPile.length})`}
        </button>
      </div>

      {showDonationPile ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Your Donation Pile</h2>
          <DonationPile items={donatedItems} onRestore={handleRestoreItem} />
        </>
      ) : (
        <div className="flex flex-col items-center">
          {activeItems.length > 0 && currentItemIndex < activeItems.length ? (
            <>
              <div className="w-full max-w-sm mb-6">
                <p className="text-center text-gray-500 mb-2">
                  Swipe left to donate, right to keep
                </p>
                <SwipeableItemCard 
                  item={activeItems[currentItemIndex]} 
                  onSwipeLeft={handleDonate}
                  onSwipeRight={handleKeep}
                />
              </div>
              
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => handleDonate(activeItems[currentItemIndex].id)}
                  className="flex items-center justify-center p-4 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                >
                  <X size={30} className="text-red-500" />
                </button>
                <button
                  onClick={handleKeep}
                  className="flex items-center justify-center p-4 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                >
                  <Check size={30} className="text-green-500" />
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  Item {currentItemIndex + 1} of {activeItems.length}
                </p>
              </div>
            </>
          ) : activeItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                You've donated all your items!
              </p>
              <button
                onClick={() => setShowDonationPile(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                View Donation Pile
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                You've gone through all your items!
              </p>
              <button
                onClick={() => setCurrentItemIndex(0)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto"
              >
                <Undo size={16} className="mr-2" />
                Start Over
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Trading;