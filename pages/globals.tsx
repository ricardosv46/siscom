export let globalProcess = '';

export const setGlobalProcess = (value: string) => {
  globalProcess = value;
};

export const getGlobalProcess = () => {
  return globalProcess;
};

export const setLocalStorageItem = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};