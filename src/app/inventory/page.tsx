'use client';

import AddInventoryItemModal from "@/components/modals/AddInventoryItemModal/AddInventoryItemModal";
import { useApprovalModal } from "@/components/modals/ApproveModal/ApproveModalContext";
import LogUseModal from "@/components/modals/LogItemUseModal/LogItemUseModal";
import { DateUtils } from "@/components/utils/dateUtils";
/* eslint-disable @typescript-eslint/no-unused-vars */
import dbService from "@/services/dbService";
import inventoryService, { InventoryItem } from "@/services/inventoryService";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// app/about.tsx
const InventoryPage = () => {

  const router = useRouter();

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isLogUseModalOpen, setIsLogUseModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>();
  const { showApprovalModal: showModal } = useApprovalModal();
  
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
      loadItems();
    };

    // Handle updating existing item
    const handleUpdateItem = (updatedItem: InventoryItem) => {
      console.log("Item updated", updatedItem)
      loadItems();
    };

    // Handle logging an item use
    const handleLogItemUse = async (item: InventoryItem, date: Date) => {
      console.log(`${item.name} used ${date}`);
      item.lastUsed = date;
      item.quantity -= 1;
      await inventoryService.updateInventoryItem(item);
      loadItems();
    };

    const handleViewDetails = (item: InventoryItem) => {
      console.log('View details for:', item);
      router.push(`/inventory/detail?itemKey=${item.name}`);
    };

    const handleDeleteItem = (item: InventoryItem) => {
      console.log('Delete item:', item);

      showModal({
        title: `Delete ${item.name}`,
        message: `Are you sure you want to delete the item <b>'${item.name}'</b>? <br> This action cannot be undone.`,
        cancelText: 'No',
        approveText: 'Yes',
        onCancel: () => console.log('Action cancelled'),
        onApprove: async () => { 
          await inventoryService.deleteInventoryItem( item ); 
          loadItems(); 
        },
      });
    };

  const openAddItemModal = ( item?: InventoryItem | undefined ) => 
    {
      setSelectedItem( item );
      setIsAddItemModalOpen(true);
    }
  const closeAddItemModal = () => 
    {
      setIsAddItemModalOpen(false);
      setSelectedItem( undefined );
    }

    const openLogUseModal = ( item?: InventoryItem | undefined ) => 
      {
        setSelectedItem( item );
        setIsLogUseModalOpen(true);
      }
    const closeLogUseModal = () => 
      {
        setIsLogUseModalOpen(false);
        setSelectedItem( undefined );
      }

  return (
    <div className="grid items-center p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="">

      <button onClick={() => openAddItemModal()} className="btn btn-outline btn-primary">Add Item</button>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {inventoryItems.map((item) => (
        <div key={item.name} className="card bg-base-100 shadow-sm border border-base-300 p-4">
          <div className="card-body p-1">
            <span className="flex justify-between">
              <h3 className="card-title text-lg font-semibold text-primary">{item.name}</h3>
              <button
                  onClick={() => handleDeleteItem(item)}
                  className="btn btn-sm btn-outline btn-circle btn-error"
                ><TrashIcon className="w-5 h-5" />
              </button>
            </span>
            <p className="text-sm bg-base-100">{item.description}</p>
            
            <div className="mt-2 flex justify-between text-sm bg-base-100">
              <span>Duration: {item.durationDays} days</span>
              <span>Quantity: {item.quantity}</span>
            </div>

            <p className="text-sm bg-base-100">Last change: { DateUtils.simpleFormatDate(item.lastUsed) }</p>
            <p className="text-xs text-primary">
              <small>{ DateUtils.formatTimeDifference( item.lastUsed )} ago</small>
            </p>

            <p className="text-sm bg-base-100">Next change: { DateUtils.simpleFormatDate( inventoryService.getNextUseDateForItem(item) ) }</p>
            <p className={`text-xs ${ DateUtils.isPast( inventoryService.getNextUseDateForItem(item) ) ?'text-error font-extrabold animate-bounce':'text-primary text-bold'}`}>
              
              <small>{ DateUtils.formatTimeDifference( inventoryService.getNextUseDateForItem(item) )}
                {DateUtils.isPast( inventoryService.getNextUseDateForItem(item) ) ? ' in the past!' : ' from now' }</small>
            </p>

            <p className="text-md text-primary">
              Supply ends: { DateUtils.formatTimeDifference( inventoryService.getFinalValidDateForItem(item) ) }
            </p>
            <p className="text-xs text-primary">
              <small>({ DateUtils.simpleFormatDate( inventoryService.getFinalValidDateForItem(item) )})</small>
            </p>


            <div className="card-actions justify-between mt-2">

              <span className="flex justify-start gap-2">
                <button
                    onClick={() => openLogUseModal(item)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    Log use
                </button>
              </span>

              <span className="flex justify-end gap-2">
                <button
                  onClick={() => openAddItemModal(item)}
                  className="btn btn-sm btn-outline btn-secondary"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleViewDetails(item)}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  View Details
                </button>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>

      {/* The modal component */}
      <AddInventoryItemModal
        selectedItem={selectedItem}
        isOpen={isAddItemModalOpen}
        onClose={closeAddItemModal}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
      />

      <LogUseModal
        isOpen={isLogUseModalOpen}
        onClose={closeLogUseModal}
        onSubmit={handleLogItemUse}
        item={selectedItem}
      />
        
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
};

export default InventoryPage;

