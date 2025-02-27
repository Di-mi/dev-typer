import { ClerkProvider } from "@clerk/nextjs"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  console.log('AdminLayout')
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <body>
            <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col">
            Admin
            <main className="flex-grow flex flex-col justify-center">
            {children}
            </main>
          </div>
      </body>
    </html >
    </ClerkProvider >
  )
}

