const memoryStorage = (() => {
  const store = new Map<string, string>();
  return {
    getItem(name: string) {
      return store.has(name) ? store.get(name)! : null;
    },
    setItem(name: string, value: string) {
      store.set(name, value);
    },
    removeItem(name: string) {
      store.delete(name);
    },
    clear() {
      store.clear();
    },
  };
})();

function getStorage() {
  if (import.meta.client && typeof window !== "undefined") {
    return window.localStorage;
  }
  return memoryStorage;
}

function key(name: string): string {
  // @ts-ignore
  return name;
  //return name.toLocaleUpperCase('en-US');
}

// 1、window.localStorage 浏览器永久缓存
export const storage = {
  // 设置永久缓存
  set<T>(name: string, value: T) {
    let raw = JSON.stringify(value);
    getStorage().setItem(key(name), raw);
  },
  // 获取永久缓存
  get<T>(name: string, defaultValue?: T): T {
    let raw = getStorage().getItem(key(name));
    if (raw == null) {
      return defaultValue as T;
    }
    return JSON.parse(raw);
  },
  // 移除永久缓存
  remove(...names: string[]) {
    const currentStorage = getStorage();
    names.forEach((name) => currentStorage.removeItem(key(name)));
  },
  // 移除全部永久缓存
  clear() {
    getStorage().clear();
  },
  getItem(name: string) {
    return getStorage().getItem(key(name));
  },
  setItem(name: string, value: string) {
    return getStorage().setItem(key(name), value);
  },
};
