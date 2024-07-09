import { create } from 'zustand'
export interface FiltersStats {
  department: string[]
  province: string[]
  distric: string[]
  position: string[]
  op: string[]
  type_pas: 'OP' | 'CANDIDATO' | ''
}

export interface FiltersStatsOption {
  department?: string[]
  province?: string[]
  distric?: string[]
  position?: string[]
  op?: string[]
  type_pas?: 'OP' | 'CANDIDATO' | ''
}

interface FilterStatsStore {
  filters: FiltersStats
  filtersAction: (filters: FiltersStatsOption) => void
  refreshFilterProcesses: () => void
  resetFilters: () => void
}

const initialFilterStats: FiltersStats = {
  department: [],
  province: [],
  distric: [],
  position: [],
  op: [],
  type_pas: ''
}

export const useFilterStats = create<FilterStatsStore>((set) => ({
  filters: initialFilterStats,
  filtersAction: (filters: FiltersStatsOption) => {
    set((state) => {
    localStorage.setItem('filtersStats', JSON.stringify({ ...state.filters, ...filters }))
      return { filters: { ...state.filters, ...filters } }
  })},
  refreshFilterProcesses: () => {
    const filtersLS = localStorage.getItem('filtersStats')
    const filtersParse: FiltersStats = filtersLS ? JSON.parse(filtersLS) : null
    if (filtersParse) {
      set({ filters: filtersParse })
    } else {
      set({ filters: initialFilterStats })
    }
  },
  resetFilters: () => {
    localStorage.removeItem('filtersStats')
    set({ filters: initialFilterStats })
  }
}))
