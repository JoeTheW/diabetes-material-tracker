// inventoryService.ts

import dbService from "./dbService";

export interface InventoryItem {
        name: string;
        description: string;
        durationDays: number;
        quantity: number;
        lastUsed: Date;
    }

class InventoryService {
    getInventoryItems(): Promise<InventoryItem[]> {
        return dbService.getAllItems('inventory');


        // return [
        //     {
        //       name: "Sensor",
        //       description: "Sensor for diabetes",
        //       durationDays: 4,
        //       quantity: 6,
        //       lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
        //     },
        // ]
    }

    storeInventoryItem( item: InventoryItem ): Promise<void> {
        return dbService.addItem( 'inventory', item);
    }

    getInventoryItem( key: string ): Promise<InventoryItem | undefined> {
        return dbService.getItemByKey( 'inventory', key);
    }

    getDatesForItem(item: InventoryItem): Date[] {
        const dates: Date[] = [];
        const startDate:Date = item.lastUsed ?? new Date();
        //for the quantity available, create an array of dates starting on item.lastUsed, with a duration of item.durationDays
        for (let i = 1; i < item.quantity; i++) {
            dates.push(new Date(startDate.getTime() + i * item.durationDays * 24 * 60 * 60 * 1000));
        }

        return dates;
      }

      getNextUseDateForItem(item: InventoryItem): Date {
        const startDate: Date = item.lastUsed ?? new Date();
        // Calculate the next use date after the last used date
        const nextUseDate = new Date(startDate.getTime() + item.durationDays * 24 * 60 * 60 * 1000);
      
        return nextUseDate;
      }

      getFinalUseDateForItem(item: InventoryItem): Date {
        const startDate:Date = item.lastUsed ?? new Date();
        //for the quantity available, create an array of dates starting on item.lastUsed, with a duration of item.durationDays
        return (new Date(startDate.getTime() + (item.quantity -1) * item.durationDays * 24 * 60 * 60 * 1000));
      }

      getFinalValidDateForItem(item: InventoryItem): Date {
        const finalUseDate = this.getFinalUseDateForItem( item );
        return new Date(
            finalUseDate.getTime() + item.durationDays * 24 * 60 * 60 * 1000
          );
      }

  }
  
  // Export a single instance of the service
  const inventoryService = new InventoryService();
  export default inventoryService;
  