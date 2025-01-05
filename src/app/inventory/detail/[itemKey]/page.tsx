'use client';

import { DateUtils } from "@/components/utils/dateUtils";
/* eslint-disable @typescript-eslint/no-unused-vars */
import dbService from "@/services/dbService";
import inventoryService, { InventoryItem } from "@/services/inventoryService";
import { useEffect, useState } from "react";

// app/about.tsx
const InventoryDetailPage = ({ params }: { params: { itemKey: string } }) => {
  const [ itemKey, setItemKey ] = useState("");
  const [item, setItem] = useState<InventoryItem | null>(null);
  
  useEffect(() => {

    const getItemKey = async () => {
      const paramItemKey = await params.itemKey;
      setItemKey(paramItemKey);

      fetchItem();
    };
    getItemKey();

    const fetchItem = async () => {
      const fetchedItem = await inventoryService.getInventoryItem( itemKey );
      setItem(fetchedItem || null);
    };

  }, [itemKey]);

  if (!item) {
    return <p>Loading...</p>;
  }

  const dates: Date[] = inventoryService.getDatesForItem( item );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-primary">{item.name}</h1>
      <p className="text-accent mt-4">{item.description}</p>
      <div className="mt-4">
        <p>Duration: {item.durationDays} days</p>
        <p>Quantity: {item.quantity}</p>
        <p>Last Used: {item.lastUsed.toLocaleDateString()}</p>
      </div>

      <p className="mt-4 text-xl font-semibold mb-4">Usage dates</p>
      <ul className="list-disc pl-6">
        {dates.map((date, index) => {
          const isPast = DateUtils.isPast( date );
          const dateClass = isPast ? "text-error font-extrabold animate-bounce" : "text-accent";

          return (
            <li key={index} className={`text-lg ${dateClass}`}>
              {DateUtils.simpleFormatDate(date)}
              {isPast && (
                <p className="ml-2 text-sm text-error italic">
                  (Past due!)
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

};

export default InventoryDetailPage;

