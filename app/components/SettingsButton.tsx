"use client"
import { Settings, X, Code, PiIcon as Python, Cog } from 'lucide-react'
import { useSidebarStore } from './hooks/hooks'

const SettingsButton = () => {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar)
  return (
    <button onClick={toggleSidebar} className="p-2 hover:bg-green-500 hover:text-black rounded transition-colors duration-200">
      <Settings size={24} />
    </button>
  )
}

export default SettingsButton
