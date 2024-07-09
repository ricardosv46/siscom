import { create } from 'zustand'

interface ElectoralProcessStore {
  electoralProcess: string
  electoralProcessAction: (electoralProcess: string) => void
  refreshElectoralProcess: () => void
  deleteElectoralProcess: () => void
}

export const useElectoralProcess = create<ElectoralProcessStore>((set) => ({
  electoralProcess: '',
  electoralProcessAction: (electoralProcess: string) => {
    localStorage.setItem('electoralProcess', electoralProcess)
    set({ electoralProcess })
  },
  refreshElectoralProcess: () => {
    const electoralProcessLS = localStorage.getItem('electoralProcess')
    if (electoralProcessLS) {
      set({ electoralProcess: electoralProcessLS })
    } else {
      set({ electoralProcess: '' })
    }
  },
  deleteElectoralProcess: () => {
    localStorage.removeItem('electoralProcess')
    set({ electoralProcess: '' })
  }
}))
