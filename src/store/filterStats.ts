import { create } from 'zustand'
export interface FiltersStats {
  department: string[]
  province: string[]
  distric: string[]
  position: string[]
  op: string[]
}

export interface FiltersStatsOption {
  department?: string[]
  province?: string[]
  distric?: string[]
  position?: string[]
  op?: string[]
}

interface FilterStatsStore {
  filters: FiltersStats
  filtersAction: (filters: FiltersStatsOption) => void
  resetFilters: () => void
}

const initialFilterStats: FiltersStats = {
  department: [],
  province: [],
  distric: [],
  position: [],
  op: []
}

export const useFilterStats = create<FilterStatsStore>((set) => ({
  filters: initialFilterStats,
  filtersAction: (filters: FiltersStatsOption) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }))
  },
  resetFilters: () => {
    set({ filters: initialFilterStats })
  }
}))
