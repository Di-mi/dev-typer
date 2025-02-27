"use client"

import { X } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const INFO_TEXT = `Test your typing speed and accuracy but with most commonly used develeper commands and characters.`


function TypingEffect({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState({ index: 0, value: '' })

  useEffect(() => {
    const typingInterval = setInterval(() => {
        setDisplayText((prev) => {
          if (prev.index === text.length - 1){
            clearInterval(typingInterval);
          } 
          return {
            index: prev.index + 1,
            value: prev.value + text[prev.index]
         }
        });
      
    }, 50)
    return () => clearInterval(typingInterval)
  }, [text])

   return (
    <div className="font-mono text-green-500">
      {displayText.value}
      <span className="inline-block animate-blink">▌</span>

    </div>
  )
}

function InfoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [text, _] = useState(INFO_TEXT);

  useEffect(() => {
    const modalName = searchParams.get('modalName');
    if (!modalName){
      setIsOpen(false);
      return;
    } 
    setIsOpen(true);
  }, [searchParams]);

  const onClose = () => {
    router.push(pathname)
  }

  return  isOpen && (
  
    <div className="fixed inset-0 bg-black opacity-80 flex items-center justify-center z-50">
      <div className="bg-black border-2 border-green-500 p-6 rounded-lg shadow-retro max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-500">Information</h2>
          <button onClick={onClose} className="text-green-500 hover:text-green-400">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <TypingEffect text={text} />
        </div>
      </div>
    </div>
  )
}

export { InfoModal }
