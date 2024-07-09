import { ListadoPas } from '@interfaces/listadoPas'
import { create } from 'zustand'

interface SelectedProcessStore {
  selectedProcess: ListadoPas | null
  selectedProcessAction: (selectedProcess: ListadoPas) => void
  refreshSelectedProcess: () => void
  deleteSelectedProcess: () => void
}

export const useSelectedProcess = create<SelectedProcessStore>((set) => ({
  selectedProcess: null,
  selectedProcessAction: (selectedProcess: ListadoPas) => {
    localStorage.setItem('selectedProcess', JSON.stringify(selectedProcess))
    set({ selectedProcess })
  },
  refreshSelectedProcess: () => {
    const selectedProcessLS = localStorage.getItem('selectedProcess')
    const selectedProcess = selectedProcessLS ? JSON.parse(selectedProcessLS) : null
    if (selectedProcessLS && selectedProcess) {
      set({ selectedProcess })
    } else {
      set({ selectedProcess: null })
    }
  },
  deleteSelectedProcess: () => {
    localStorage.removeItem('selectedProcess')
    set({ selectedProcess: null })
  }
}))
