"use client"


import { X, Code, PiIcon as Python, Cog } from 'lucide-react'

import {useSidebarStore} from './hooks/hooks'
import { SUPPORTED_LANGUAGES } from './common/types'

const LANGUAGES: {name: SUPPORTED_LANGUAGES, icon: any }[] = [
  { name: 'JavaScript', icon: Code },
  { name: 'Python', icon: Python },
  { name: 'Rust', icon: Cog }
]

const Sidebar = () => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen)
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
  const selectedLanguage = useSidebarStore((state) => state.selectedLanguage)
  const setSelectedLanguage = useSidebarStore((state) => state.setSelectedLanguage)
  return (
    <>
      <style jsx global>{`
        .shadow-glow {
          box-shadow: 
            0 0 5px #00ff00,
            0 0 10px #00ff00,
            0 0 15px #00ff00,
            0 0 20px #00ff00;
        }

        /* Checkbox hover effect */
        label:hover .border-green-500 {
          box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
        }
      `}</style>
      <aside
        className={`fixed top-0 right-0 w-80 h-full bg-black border-l-2 border-green-500 transform transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-4 border-b border-green-500 flex justify-between items-center">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={toggleSidebar} className="p-1 hover:bg-green-500 hover:text-black rounded transition-colors duration-200">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Language Preference</h3>
          <div className="space-y-4">
            {LANGUAGES.map((lang) => (
              <label key={lang.name} className="flex items-center space-x-3 text-lg cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value={lang.name}
                  checked={selectedLanguage === lang.name}
                  onChange={() => setSelectedLanguage(lang.name)}
                  className="sr-only"
                />
                <span className="relative w-6 h-6 flex items-center justify-center">
                  <span className="absolute inset-0 bg-black border-2 border-green-500 rounded-sm"></span>
                  {selectedLanguage === lang.name && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-3 h-3 bg-green-500 rounded-sm shadow-glow"></span>
                    </span>
                  )}
                </span>
                <span className="flex items-center">
                  <lang.icon className="mr-2" size={24} />
                  {lang.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )
      }
    </>
  )
}

export default Sidebar
