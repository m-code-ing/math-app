/**
 * StorageService - Pure data persistence layer
 * Handles all localStorage operations with error handling
 */
export class StorageService {
  private readonly prefix = 'math-app:';

  /**
   * Save data to localStorage
   */
  save<T>(key: string, data: T): void {
    try {
      const prefixedKey = this.prefix + key;
      const serialized = JSON.stringify(data);
      localStorage.setItem(prefixedKey, serialized);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        throw new Error('Storage quota exceeded');
      }
      console.error('Failed to save to localStorage:', error);
      throw error;
    }
  }

  /**
   * Load data from localStorage
   */
  load<T>(key: string): T | null {
    try {
      const prefixedKey = this.prefix + key;
      const serialized = localStorage.getItem(prefixedKey);
      
      if (serialized === null) {
        return null;
      }
      
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   */
  remove(key: string): void {
    try {
      const prefixedKey = this.prefix + key;
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Clear all app data from localStorage
   */
  clear(): void {
    try {
      const keys = this.getAllKeys();
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get all app-specific keys from localStorage
   */
  getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }
}
