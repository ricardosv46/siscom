import { create } from "zustand";
import { IMenuStore } from "./menu.interface";
import { GetProcessElectoralStorageService, StoreProcessElectoralStorageService } from "services/process-electoral/ProcessElectoral";

const useMenuStore = create<IMenuStore>((set, get) => ({
   IdSelectedProcess: '',
   changeStateSelectedProcess: (id) => {
      set({ IdSelectedProcess: id });
      StoreProcessElectoralStorageService({ id })
   },
   getStateSelectedProcess: async () => {
      const id = await GetProcessElectoralStorageService()
      if(id){
        set({ IdSelectedProcess:  id });
      }
   }
   
}));

export default useMenuStore;
