'use client';

import { InventoryItem } from '@/services/inventoryService';
import React, { useEffect, useState } from 'react';

type LogUseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: InventoryItem, date: Date) => void;
  item: InventoryItem | undefined;
};

const LogUseModal: React.FC<LogUseModalProps> = ({ isOpen, onClose, onSubmit, item }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    setSelectedDate( new Date().toISOString().split('T')[0] );
  }, [isOpen]);

  const handleSubmit = () => {
    if ( item && selectedDate) {
      const dateObject = new Date(selectedDate);
      onSubmit( item, dateObject);
    }
    onClose();
  };

  if (!isOpen) return null;

  if (!item) return ( <p>loading...</p> )

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Log Use for {item?.name}</h3>
        <div className="py-4">
          <label className="block mb-2">Usage date</label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!selectedDate}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogUseModal;
