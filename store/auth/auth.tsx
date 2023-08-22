import { create } from "zustand";
import { IAuthStore } from "./auth.interface";
import {
  GetAuthService,
  RemoveSessionAuthService,
  StoreAuthService,
  StoreTokenService,
} from "services/auth/ServiceAuth";
import { RemoveProcessElectoralStorageService } from "services/process-electoral/ProcessElectoral";

const useAuthStore = create<IAuthStore>((set, get) => ({
  user: {
    id: 0,
    profile: "",
    is_admin: false,
  },
  islogged: false,
  storeUser: (userdata, token) => {
    if (userdata) {
      StoreAuthService({
        user: userdata,
      });
      token && StoreTokenService(token);
      set({ user: userdata });
      set({ islogged: true });
    }
  },
  getUser: () => {
    const { user } = GetAuthService();
    set({ user });
    set({ islogged: true });
  },
  removeSession: () => {
    RemoveProcessElectoralStorageService()
    RemoveSessionAuthService();
    set({
      user: {
        id: 0,
        profile: "",
        is_admin: false,
      },
    });
    set({ islogged: false });
  },
}));

export default useAuthStore;
