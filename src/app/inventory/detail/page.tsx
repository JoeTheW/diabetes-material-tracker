// app/inventory/detail/page.tsx
'use client';

import { DateUtils } from "@/components/utils/dateUtils";
import inventoryService, { InventoryItem } from "@/services/inventoryService";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

const InventoryDetailPage = () => {
  
  const [item, setItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const { search } = window.location;
    const urlParams = new URLSearchParams(search);
    const itemKey = urlParams.get("itemKey"); // Get the itemKey from URL params

    if (itemKey) {
      const fetchItem = async () => {
        const fetchedItem = await inventoryService.getInventoryItem(itemKey);
        setItem(fetchedItem || null);
      };

      fetchItem();
    }
  }, []); // Refetch if itemKey changes

  if (!item) {
    return (
      <>
        <Link href="/inventory" className="btn btn-ghost px-8">
          <ArrowUturnLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </Link>
        <p className="px-8">Loading...</p>
      </>
    );
  }

  const dates: Date[] = inventoryService.getDatesForItem(item);

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
          <p><small className="text-xs">Last change:</small><br /> {DateUtils.simpleFormatDate(item.lastUsed)}</p>
        </div>

        <p className="mt-4 text-xl font-semibold mb-4">Usage dates</p>
        <ul className="list-disc pl-6">
          {dates.map((date, index) => {
            const isPast = DateUtils.isPast(date);
            const dateClass = isPast ? "text-error font-extrabold animate-bounce" : "bg-base-100";

            return (
              <li key={index} className={`text-lg ${dateClass}`}>
                {DateUtils.simpleFormatDate(date)}
                {!isPast && index === 0 && (
                  <p className="text-xs">{DateUtils.formatTimeDifference(date)} from now</p>
                )}
                {isPast && (
                  <p className="ml-2 text-sm text-error italic">(Past due!)</p>
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
