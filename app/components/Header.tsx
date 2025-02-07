import { Info, Keyboard } from "lucide-react"
import LastResult from "./LastResult"
import SettingsButton from "./SettingsButton"
import Link from 'next/link'
import Image from 'next/image'
const Header = () => {


  return (
    <header className="w-full flex justify-between items-center p-4 border-b-2 border-green-500">
      <h1 className="text-3xl font-bold flex items-center">
          <Image src={'/assets/keyboard.jpg'} alt="keyboard" width={64} height={36} className="mr-2 animate-pulse" />
          <span className="bg-green-500 text-black px-2 py-1 rounded mr-2 transform -skew-x-12">Dev</span>
          <span className="underline decoration-green-500 decoration-4 underline-offset-8"> Typer</span>
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
