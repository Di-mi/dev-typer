import { create } from 'zustand'
import { SUPPORTED_LANGUAGES } from '../common/types'
import { persist } from 'zustand/middleware'


type SidebarState = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSelectedLanguage: (lang: SUPPORTED_LANGUAGES) => void
  selectedLanguage: SUPPORTED_LANGUAGES
}

type TYPING_RESULT = {
  wpm: number
  accuracy: number

}
type HeaderState = {
  lastResult: TYPING_RESULT| null
  setLastResult: (result: TYPING_RESULT) => void
}

const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen: false,
  selectedLanguage: 'Python',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSelectedLanguage: (lang: SUPPORTED_LANGUAGES) => set({ selectedLanguage: lang })
}))

const useHeaderStore = create<HeaderState>()(persist((set) => ({
  lastResult: null,
  setLastResult: (result) => set({ lastResult: result })
}), { name: 'header-store' }));


export {
  useSidebarStore, 
  useHeaderStore
}
