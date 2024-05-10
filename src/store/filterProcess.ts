import { Dayjs } from 'dayjs'
import { create } from 'zustand'
export interface Filters {
  search: string
  status: string
  statusRJ: string
  responsible: string
  typeProcess: string
  date: [Dayjs | null | undefined, Dayjs | null | undefined]
  dateStart: string
  dateEnd: string
}

interface FilterProcessesStore {
  filters: Filters
  filtersAction: (filters: Filters) => void
  refreshFilterProcesses: () => void
  resetFilters: () => void
}

const initialFilterProcesses: Filters = {
  search: '',
  status: '',
  statusRJ: '',
  responsible: 'all',
  typeProcess: '',
  date: [null, null],
  dateStart: '',
  dateEnd: ''
}

export const useFilterProcesses = create<FilterProcessesStore>((set) => ({
  filters: initialFilterProcesses,
  filtersAction: (filters: Filters) => {
    localStorage.setItem('filters', JSON.stringify(filters))
    set({ filters })
  },
  refreshFilterProcesses: () => {
    const filtersLS = localStorage.getItem('filters')
    const filtersParse: Filters = filtersLS ? JSON.parse(filtersLS) : null

    if (filtersParse) {
      set({ filters: filtersParse })
    } else {
      set({ filters: initialFilterProcesses })
    }
  },
  resetFilters: () => {
    localStorage.removeItem('filters')
    set({ filters: initialFilterProcesses })
  }
}))
