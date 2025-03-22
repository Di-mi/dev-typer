"use client"

import { useUser, SignInButton, SignUpButton, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';



function ProfileModal(props: { isOpen: boolean; toggleMenu?: () => void }) {


  const isOpen = props.isOpen
  const toggleMenu = props.toggleMenu
  const { isSignedIn, user } = useUser()
  return isOpen && (
    <>
      <div className="fixed inset-0 bg-black opacity-30 z-40" onClick={() => toggleMenu()}></div>
      <div
        className={`fixed top-16 right-4 w-64 bg-black border-2 border-green-500 rounded-md shadow-retro transform transition-all duration-300 ease-in-out z-50 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          } ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="p-4 border-b border-green-500">
          <h2 className="text-xl font-bold">{isSignedIn ? "User Profile" : "Welcome"}</h2>
        </div>
        <div className="p-4 space-y-4">
          {isSignedIn ? (
            <>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-black text-2xl font-bold">
                  <img src={user.imageUrl} alt="profile" className="rounded-full" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.fullName}</h3>
                  <p className="text-sm text-green-400">Pro Typer</p>
                </div>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Email:</span> {user.primaryEmailAddress.emailAddress}
                </p>
                <p>
                  <span className="font-semibold">Best WPM:</span> 120
                </p>
                <p>
                  <span className="font-semibold">Avg. Accuracy:</span> 98%
                </p>
              </div>

              <div className="flex flex-col">
                <Link href="/stats" onClick={toggleMenu} className='my-4'>
                  <button className="w-full px-4 py-2 bg-green-500 text-black rounded-md shadow-retro hover:bg-green-400 active:shadow-inner-retro transition-all duration-200">
                    Stats
                  </button>
                </Link>

                <SignOutButton>
                  <button
                    className="w-full px-4 py-2 bg-green-500 text-black rounded-md shadow-retro hover:bg-green-400 active:shadow-inner-retro transition-all duration-200">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </>
          ) : (
            <>
              <p className="text-center">Sign in to track your progress and compete with other typists!</p>
              <SignInButton>
                <button
                  className="w-full px-4 py-2 bg-green-500 text-black rounded-md shadow-retro hover:bg-green-400 active:shadow-inner-retro transition-all duration-200">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton >
                <button className="w-full px-4 py-2 border-2 border-green-500 text-green-500 rounded-md shadow-retro hover:bg-green-500 hover:text-black active:shadow-inner-retro transition-all duration-200">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export { ProfileModal }
