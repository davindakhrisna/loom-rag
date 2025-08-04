"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ContantDrop() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Contact</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="https://mail.google.com/mail/?view=cm&fs=1&to=arpeggio.gns@gmail.com"
              target="_blank"
              rel="noopener noreferrer">
              Gmail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="https://github.com/davindakhrisna" target="_blank">Github</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="https://instagram.com/@kryisnn" target="_blank">Instagram</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Home() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-16 py-4 backdrop-blur-xl bg-black/50">
        <div className="flex items-center gap-2">
          <Link href="#" className="flex items-center gap-3">
            <Logo />
            <span className="font-medium text-white">Loom</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="http://www.primetheory.com/summary-prime-motivation.php" className="text-sm text-gray-300 hover:text-white transition-colors">
            Abstraction
          </Link>
          <Link href="https://github.com/davindakhrisna/loom-rag" className="text-sm text-gray-300 hover:text-white transition-colors">
            Github
          </Link>
          <Link href="https://www.paypal.com/paypalme/DavindaKhrisna" className="text-sm text-gray-300 hover:text-white transition-colors">
            Donate
          </Link>
          <ContantDrop />
        </nav>
        <Link href="/login">
          <Button variant="secondary" className="bg-white cursor-pointer text-black hover:bg-gray-100">
            Join Now
          </Button>
        </Link>
      </div>
    </nav>
  )
}

const Navbar = () => {
  return < Home />;
}

export default Navbar;
