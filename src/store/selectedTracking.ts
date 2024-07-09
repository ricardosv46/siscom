import { Tracking } from '@interfaces/listadoPas'
import { create } from 'zustand'

interface SelectedTrackingStore {
  selectedTracking: Tracking | null
  selectedTrackingAction: (selectedTracking: Tracking) => void
  refreshSelectedTracking: () => void
  deleteSelectedTracking: () => void
}

export const useSelectedTracking = create<SelectedTrackingStore>((set) => ({
  selectedTracking: null,
  selectedTrackingAction: (selectedTracking: Tracking) => {
    localStorage.setItem('selectedTracking', JSON.stringify(selectedTracking))
    set({ selectedTracking })
  },
  refreshSelectedTracking: () => {
    const selectedTrackingLS = localStorage.getItem('selectedTracking')
    const selectedTracking = selectedTrackingLS ? JSON.parse(selectedTrackingLS) : null
    if (selectedTrackingLS && selectedTracking) {
      set({ selectedTracking })
    } else {
      set({ selectedTracking: null })
    }
  },
  deleteSelectedTracking: () => {
    localStorage.removeItem('selectedTracking')
    set({ selectedTracking: null })
  }
}))
