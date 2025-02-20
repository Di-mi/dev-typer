"use client"

import { User } from 'lucide-react'
import { useState } from 'react'
import { ProfileModal } from './ProfileModal'

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="p-2 hover:bg-green-500 hover:text-black rounded transition-colors duration-200"
    >
      <User size={24} />
    </button>
    <ProfileModal isOpen={isOpen} toggleMenu={() => setIsOpen(false)}/>
    </>

  )
}

export { ProfileButton }
