// inventoryService.ts
class InventoryService {
    async getInventory() {
      const response = await fetch('/api/inventory');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      return await response.json();
    }
  
    async addInventory(item: { name: string; description: string }) {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Failed to add inventory');
      }
      return await response.json();
    }
  }
  
  // Export a single instance of the service
  const inventoryService = new InventoryService();
  export default inventoryService;
  