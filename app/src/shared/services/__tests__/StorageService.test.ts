import { StorageService } from '../StorageService';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = new StorageService();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('save and load', () => {
    it('saves and loads string data', () => {
      service.save('test-key', 'test-value');
      const result = service.load<string>('test-key');
      expect(result).toBe('test-value');
    });

    it('saves and loads object data', () => {
      const data = { name: 'test', value: 123 };
      service.save('test-obj', data);
      const result = service.load<typeof data>('test-obj');
      expect(result).toEqual(data);
    });

    it('saves and loads array data', () => {
      const data = [1, 2, 3, 4, 5];
      service.save('test-array', data);
      const result = service.load<number[]>('test-array');
      expect(result).toEqual(data);
    });

    it('returns null for non-existent key', () => {
      const result = service.load('non-existent');
      expect(result).toBeNull();
    });

    it('prefixes keys with app namespace', () => {
      service.save('test', 'value');
      const rawValue = localStorage.getItem('math-app:test');
      expect(rawValue).toBe('"value"');
    });
  });

  describe('remove', () => {
    it('removes data from storage', () => {
      service.save('test', 'value');
      expect(service.load('test')).toBe('value');
      
      service.remove('test');
      expect(service.load('test')).toBeNull();
    });

    it('handles removing non-existent key', () => {
      expect(() => service.remove('non-existent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('clears all app data', () => {
      service.save('key1', 'value1');
      service.save('key2', 'value2');
      service.save('key3', 'value3');
      
      service.clear();
      
      expect(service.load('key1')).toBeNull();
      expect(service.load('key2')).toBeNull();
      expect(service.load('key3')).toBeNull();
    });

    it('does not clear non-app data', () => {
      localStorage.setItem('other-app:key', 'value');
      service.save('app-key', 'value');
      
      service.clear();
      
      expect(localStorage.getItem('other-app:key')).toBe('value');
      expect(service.load('app-key')).toBeNull();
    });
  });

  describe('getAllKeys', () => {
    it('returns all app-specific keys', () => {
      service.save('key1', 'value1');
      service.save('key2', 'value2');
      localStorage.setItem('other-app:key', 'value');
      
      const keys = service.getAllKeys();
      
      expect(keys).toHaveLength(2);
      expect(keys).toContain('math-app:key1');
      expect(keys).toContain('math-app:key2');
      expect(keys).not.toContain('other-app:key');
    });

    it('returns empty array when no keys exist', () => {
      const keys = service.getAllKeys();
      expect(keys).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('handles corrupted JSON data', () => {
      localStorage.setItem('math-app:corrupted', 'invalid-json{');
      const result = service.load('corrupted');
      expect(result).toBeNull();
    });

    it('handles save errors gracefully', () => {
      // Mock localStorage.setItem to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('Mock error');
      });

      expect(() => service.save('test', 'value')).toThrow();

      // Restore
      Storage.prototype.setItem = originalSetItem;
    });
  });
});
