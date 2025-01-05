'use client';

import AddInventoryItemModal from "@/components/modals/AddInventoryItemModal/AddInventoryItemModal";
import { DateUtils } from "@/components/utils/dateUtils";
/* eslint-disable @typescript-eslint/no-unused-vars */
import dbService from "@/services/dbService";
import inventoryService, { InventoryItem } from "@/services/inventoryService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// app/about.tsx
const InventoryPage = () => {

  const router = useRouter();

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    loadItems();
  }, []);

  // Get items from IndexedDB when the component mounts
  const loadItems = async () => {
    const items = await inventoryService.getInventoryItems();
    setInventoryItems(items);
  };

    // Handle adding a new item to the inventory
    const handleAddItem = (newItem: InventoryItem) => {
      console.log("Item added", newItem)
      setInventoryItems((prevItems) => [...prevItems, newItem]);
      // loadItems();
    };

    const handleViewDetails = (item: InventoryItem) => {
      console.log('View details for:', item);
      router.push(`/inventory/detail/${item.name}`);
    };

  // Toggle the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="grid items-center p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="">

      <button onClick={openModal} className="btn btn-primary">Add Item</button>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {inventoryItems.map((item) => (
        <div key={item.name} className="card bg-base-100 shadow-sm border border-base-300 p-4">
          <div className="card-body p-1">
            <h3 className="card-title text-lg font-semibold text-primary">{item.name}</h3>
            <p className="text-sm text-accent">{item.description}</p>

            <p className="text-sm text-accent">Last change: { DateUtils.simpleFormatDate(item.lastUsed) }</p>
            <p className="text-xs text-primary">
              <small>{ DateUtils.formatTimeDifference( item.lastUsed )} ago</small>
            </p>

            <p className="text-sm text-accent">Next change: { DateUtils.simpleFormatDate( inventoryService.getNextUseDateForItem(item) ) }</p>
            <p className={`text-xs ${ DateUtils.isPast( inventoryService.getNextUseDateForItem(item) ) ?'text-primary':'text-error'}`}>
              
              <small>{ DateUtils.formatTimeDifference( inventoryService.getNextUseDateForItem(item) )}
                {DateUtils.isPast( inventoryService.getNextUseDateForItem(item) ) ? ' from now':' in the past!'}</small>
            </p>

            <div className="mt-2 flex justify-between text-sm text-accent">
              <span>Duration: {item.durationDays} days</span>
              <span>Quantity: {item.quantity}</span>
            </div>
            <p className="text-md text-primary">
              Restock estimate: { DateUtils.formatTimeDifference( inventoryService.getFinalValidDateForItem(item) ) }
            </p>
            <p className="text-xs text-primary">
              <small>({ DateUtils.simpleFormatDate( inventoryService.getFinalValidDateForItem(item) )})</small>
            </p>

            <div className="card-actions justify-end mt-4">
              <button
                onClick={() => handleViewDetails(item)}
                className="btn btn-sm btn-primary"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

      {/* The modal component */}
      <AddInventoryItemModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddItem={handleAddItem}
      />
        
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
};

export default InventoryPage;

