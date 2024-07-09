import { LoginRes, User } from '@interfaces/login'
import { create } from 'zustand'

interface AuthStore {
  isAuth: boolean
  user: User | null
  isLoading: boolean
  logoutAction: () => void
  loginAction: (user: LoginRes) => void
  loadingAction: (loading: boolean) => void
  refreshAuth: () => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuth: false,
  modalLogout: false,
  isLoading: true,
  logoutAction: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ isAuth: false, user: null })
  },
  loginAction: (data: LoginRes) => {
    localStorage.setItem('token', data?.token)
    localStorage.setItem('user', JSON.stringify(data?.user))
    set({ isAuth: true, user: data?.user })
  },
  loadingAction: (isLoading: boolean) => set({ isLoading }),
  refreshAuth: () => {
    set({ isLoading: true })
    const tokenLS = localStorage.getItem('token')
    const userLS = localStorage.getItem('user')
    const user = userLS ? JSON.parse(userLS) : {}
    if (tokenLS && user) {
      set({ isAuth: true, user })
    } else {
      set({ isAuth: false, user: null })
    }
    set({ isLoading: false })
  }
}))
