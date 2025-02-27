import 'app/globals.css'
import Header from 'lib/components/Header';
import Sidebar from 'lib/components/Sidebar';
import { Github } from 'lucide-react';
import { ClerkProvider } from '@clerk/nextjs';
import { PostHogProvider } from 'app/providers';

export const metadata = {
  title: 'Dev Typer',
  description: 'Test you typing speed and accuracy but with most commonly used develeper commands and characters.',
  icons: '/favicon.ico',
  keywords: ['typing', 'speed', 'test', 'developer', 'commands', 'characters'],
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://dev-typer.vercel.app/',
    siteName: 'Dev Typer',
    images: [
      {
        url: '/assets/keyboard.jpg',
        width: 800,
        height: 600,
        alt: 'keyboard',
      },
    ],
  },

};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <body>
          <PostHogProvider>
            <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col">
            <Header />
            <main className="flex-grow flex flex-col justify-center">
            {children}
            </main>
            <Sidebar />
            <footer className="w-full border-t-2 border-green-500 p-4 text-center">
              <div className="flex justify-center items-center space-x-4">
                <a href="https://github.com/Di-mi/dev-typer" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-400 transition-colors duration-200">
                  <Github size={20} className="mr-2" />
                  View on GitHub
                </a>
                <span>|</span>
                <span>© 2025 Retro Speed Typer</span>
              </div>
            </footer>
          </div>
        </PostHogProvider>
      </body>
    </html >

    </ClerkProvider >
  )
}
