'use client';

import { DateUtils } from "@/components/utils/dateUtils";
/* eslint-disable @typescript-eslint/no-unused-vars */
import dbService from "@/services/dbService";
import inventoryService, { InventoryItem } from "@/services/inventoryService";
import { ArrowUturnLeftIcon, BackwardIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
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
    <>
    <Link href="/inventory" className="btn btn-ghost px-8">
      <ArrowUturnLeftIcon className="w-5 h-5" />
      <span>Back</span>
    </Link>
    <div className="px-8">
      <h1 className="text-3xl font-bold text-primary">{item.name}</h1>
      <p className="bg-base-100 mt-4">{item.description}</p>
      <div className="mt-4">
        <p><small className="text-xs">Duration:</small> {item.durationDays} days</p>
        <p><small className="text-xs">Quantity:</small> {item.quantity}</p>
        <p><small className="text-xs">Last change:</small><br></br> {DateUtils.simpleFormatDate(item.lastUsed)}</p>
      </div>

      <p className="mt-4 text-xl font-semibold mb-4">Usage dates</p>
      <ul className="list-disc pl-6">
        {dates.map((date, index) => {
          const isPast = DateUtils.isPast( date );
          const dateClass = isPast ? "text-error font-extrabold animate-bounce" : "bg-base-100";

          return (
            <li key={index} className={`text-lg ${dateClass}`}>
              {DateUtils.simpleFormatDate(date)}
              {!isPast && index == 0 && ( 
                <p className="text-xs">{DateUtils.formatTimeDifference( date )} from now</p>
              )}
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
    </>
  );
};

export default InventoryDetailPage;

