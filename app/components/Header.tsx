import { Info } from "lucide-react"
import LastResult from "./LastResult"
import SettingsButton from "./SettingsButton"
import Link from 'next/link'

const Header = () => {



  return (
    <header className="w-full flex justify-between items-center p-4 border-b-2 border-green-500">
      <h1 className="text-2xl font-bold">Retro Speed Typer</h1>
      <div className="flex items-center space-x-4">
        <LastResult />
        <Link href={{query: { modalName: 'info'}}}> <Info/> </Link>
        <SettingsButton />

      </div>
    </header>

  )
}

export default Header
