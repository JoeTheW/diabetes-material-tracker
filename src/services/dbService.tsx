import { IDBPDatabase, openDB } from 'idb';
import { InventoryItem } from './inventoryService';

class DBService {

  private dbName: string = 'diabetesMaterialDB';
  private db?: IDBPDatabase<unknown>;
  private dbReady: Promise<void>; // Promise to track the DB initialization

  // Constructor is private to prevent multiple instances
  private constructor() {
    if (typeof window !== 'undefined' && window.indexedDB) {
      this.dbReady = this.initializeDB();
    } else {
      console.warn('IndexedDB is not available in this environment.');
      this.dbReady = Promise.reject('IndexedDB is not available.');
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

  // Ensure the DB is initialized before performing operations
  private async waitForDB(): Promise<void> {
    await this.dbReady;
    if (!this.db) {
      throw new Error("Database is not initialized.");
    }
  }

  // Get all items from the inventory
  public async getAllItems(storeName: string): Promise<InventoryItem[]> {
    await this.waitForDB();
    return await this.db!.getAll(storeName);
  }

  public async getAllKeys(storeName: string): Promise<IDBValidKey[]> {
    await this.waitForDB();
    return await this.db!.getAllKeys(storeName);
  }

  // Add item if it doesn't already exist
  public async addItem(storeName: string, item: InventoryItem): Promise<void> {
    await this.waitForDB();
    const existingItem = await this.db!.get(storeName, item.name);
    if (existingItem) {
      throw new Error('Item already exists in the database');
    }
    await this.db!.put(storeName, item);
  }

  // Update item
  public async updateItem(storeName: string, item: InventoryItem): Promise<void> {
    await this.waitForDB();
    const existingItem = await this.db!.get(storeName, item.name);
    if (!existingItem) {
      throw new Error("Item doesn't exist in the database");
    }
    await this.db!.put(storeName, item);
  }

  // Get a single item by its name
  public async getItemByKey(storeName: string, name: string): Promise<InventoryItem | undefined> {
    await this.waitForDB();
    return await this.db!.get(storeName, name);
  }

  // Delete an item by its name
  public async deleteItem(storeName: string, name: string): Promise<void> {
    await this.waitForDB();
    await this.db!.delete(storeName, name);
  }
}

const dbService = DBService.getInstance();
export default dbService;
