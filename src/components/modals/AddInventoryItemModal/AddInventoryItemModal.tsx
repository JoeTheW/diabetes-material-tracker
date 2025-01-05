import inventoryService, { InventoryItem } from '@/services/inventoryService';
import { useEffect, useState } from 'react';

interface AddItemModalProps {
    selectedItem: InventoryItem | undefined;
    isOpen: boolean;
    onClose: () => void;
    onAddItem: (item: InventoryItem) => void;
    onUpdateItem: (item: InventoryItem) => void;
}

const AddInventoryItemModal: React.FC<AddItemModalProps> = ({ selectedItem, isOpen, onClose, onAddItem, onUpdateItem }) => {
  // Define state for the form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [lastUsed, setLastUsed] = useState<Date>(new Date());

  useEffect(() => {

    if ( selectedItem)
    {
      setName(selectedItem.name);
      setDescription(selectedItem.description);
      setDurationDays(selectedItem.durationDays);
      setQuantity(selectedItem.quantity);
      setLastUsed(selectedItem.lastUsed);
    }

  }, [selectedItem, isOpen, onClose, onAddItem, onUpdateItem])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const inventoryItem: InventoryItem = {
        name,
        description,
        durationDays,
        quantity,
        lastUsed,
      };

      if ( !selectedItem)
      {
        //New item
        // Add the item to IndexedDB using DBService
        await inventoryService.storeInventoryItem(inventoryItem);
        // Call onAddItem to update the parent state and refresh the inventory
        onAddItem(inventoryItem);
      }
      else
      {
        //Updated item
        await inventoryService.updateInventoryItem(inventoryItem);
        // Call onAddItem to update the parent state and refresh the inventory
        onUpdateItem(inventoryItem);
      }

    onClose(); // Close the modal after submission
  };

  const clear = () => {
    setName('');
      setDescription('');
      setDurationDays(0);
      setQuantity(0);
      setLastUsed(new Date());
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl mb-4">{ selectedItem ? 'Update' : 'Add'} Inventory Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input input-bordered w-full"
                  disabled={selectedItem !== undefined}
                />
              </div>

              <div>
                <label htmlFor="description" className="block">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label htmlFor="durationDays" className="block">Duration (Days)</label>
                <input
                  id="durationDays"
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label htmlFor="lastUsed" className="block">Last Used</label>
                <input
                  id="lastUsed"
                  type="date"
                  value={lastUsed.toISOString().substring(0, 10)}
                  onChange={(e) => setLastUsed(new Date(e.target.value))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={ () => { clear(); onClose() } }
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                { selectedItem ? 'Save' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddInventoryItemModal;
