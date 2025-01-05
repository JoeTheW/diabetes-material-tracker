import { openDB } from 'idb';
import { InventoryItem } from './inventoryService';

class DBService {
  private dbName: string = 'diabetesMaterialDB';
  private db: any;

  // Constructor is private to prevent multiple instances
  private constructor() {
    if (typeof window !== 'undefined' && window.indexedDB) {
      this.initializeDB();
    } else {
      console.warn('IndexedDB is not available in this environment.');
    }
  }

  // The static method to get the instance of DBService
  static instance: DBService;

  // Get the singleton instance of DBService
  public static getInstance(): DBService {
    if (!DBService.instance) {
      DBService.instance = new DBService();
    }
    return DBService.instance;
  }

  // Initialize IndexedDB and create the object store if not exists
  private async initializeDB() {

    this.db = await openDB(this.dbName, 1, {
      upgrade(db) {
        // Access storeName directly here (no need for 'this')
        if (!db.objectStoreNames.contains('inventory')) {
          db.createObjectStore('inventory', { keyPath: 'name' });
        }
      },
    });
  }

  // Get all items from the inventory
  public async getAllItems( storeName: string ): Promise<InventoryItem[]> {
    return await this.db.getAll(storeName);
  }

 // Add item if it doesn't already exist
 public async addItem(storeName: string, item: InventoryItem): Promise<void> {
  if (!this.db) {
    throw new Error("Database is not initialized.");
  }

  // Check if the item already exists based on its name
  const existingItem = await this.db.get(storeName, item.name);

  if (existingItem) {
    throw new Error('Item already exists in the database');
  }

  // If the item does not exist, add it
  await this.db.put(storeName, item);
}

  // Get a single item by its name
  public async getItemByKey(storeName: string, name: string): Promise<InventoryItem | undefined> {
    return await this.db.get(storeName, name);
  }

  // Delete an item by its name
  public async deleteItem(storeName: string, name: string): Promise<void> {
    await this.db.delete(storeName, name);
  }
}

const dbService = DBService.getInstance();
export default dbService;
