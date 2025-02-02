import { Info, Keyboard } from "lucide-react"
import LastResult from "./LastResult"
import SettingsButton from "./SettingsButton"
import Link from 'next/link'

const Header = () => {


  return (
    <header className="w-full flex justify-between items-center p-4 border-b-2 border-green-500">
      <h1 className="text-3xl font-bold flex items-center">
          <Keyboard className="mr-2 animate-pulse" size={36} />
          <span className="bg-green-500 text-black px-2 py-1 rounded mr-2 transform -skew-x-12">Retro</span>
          <span className="underline decoration-green-500 decoration-4 underline-offset-8">Speed Typer</span>
        </h1>

      <div className="flex items-center space-x-4">
        <LastResult />
        <Link href={{query: { modalName: 'info'}}}> <Info/> </Link>
        <SettingsButton />

      </div>
    </header>

  )
}

export default Header
