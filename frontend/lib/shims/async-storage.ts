type Value = string | null;

const store = new Map<string, string>();

const AsyncStorage = {
  async getItem(key: string): Promise<Value> {
    return store.has(key) ? store.get(key)! : null;
  },
  async setItem(key: string, value: string): Promise<void> {
    store.set(key, value);
  },
  async removeItem(key: string): Promise<void> {
    store.delete(key);
  },
  async clear(): Promise<void> {
    store.clear();
  },
};

export default AsyncStorage;
export const getItem = AsyncStorage.getItem;
export const setItem = AsyncStorage.setItem;
export const removeItem = AsyncStorage.removeItem;
export const clear = AsyncStorage.clear;
