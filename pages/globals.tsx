export let globalProcess = '';

export const setGlobalProcess = (value: string) => {
  globalProcess = value;
};

export const getGlobalProcess = () => {
  return globalProcess;
};