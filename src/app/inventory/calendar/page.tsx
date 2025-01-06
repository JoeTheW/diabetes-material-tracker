"use client";

import MonthView from "@/components/calendar/MonthView";
import { useState, useEffect } from "react";
import inventoryService, { InventoryItem } from "@/services/inventoryService";

interface CalendarItem {
  name: string;
  color: string;
  dates: Date[];
}

const CalendarPage = () => {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [ready, setReady] = useState(false);

  // Fetch inventory items and transform them into calendar items
  useEffect(() => {
    const fetchInventoryItems = async () => {
      const inventoryItems: InventoryItem[] = await inventoryService.getInventoryItems();
      const calendarItems: CalendarItem[] = inventoryItems.map((item, index, array) => {
        const dates = inventoryService.getDatesForItem(item);

        //add last used date to the start of the array
        if (item.lastUsed) {
          dates.unshift(item.lastUsed);
        }
        
        const color = generateDistinctColor(index, array.length); // Use our distinct color function
        return { name: item.name, color, dates };
      });
      setItems(calendarItems);
      setReady( true );
    };

    fetchInventoryItems();
  }, []);

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  if ( !ready )
  {
    return(
      <div className="p-8">
      <p className="animate-bounce">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <MonthView
        items={items}
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
      />
    </div>
  );
};

// Helper function to generate distinct vibrant colors
const generateDistinctColor = (index: number, totalItems: number): string => {
  const hueStep = Math.floor(360 / totalItems); // Evenly spread hues
  const hue = (index * hueStep) % 360; // Calculate hue based on index
  return `hsl(${hue}, 70%, 50%)`; // Vibrant color with 70% saturation and 50% lightness
};

export default CalendarPage;
