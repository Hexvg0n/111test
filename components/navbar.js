"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils" // Assuming cn and lucide-react are correctly set up
import { Menu, X } from "lucide-react"
import "@/public/style/fonts.css" // Make sure Poppins is imported/defined here or in your global styles

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isOpenRef = useRef(isOpen)

  // Update ref when isOpen changes
  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Prevent scrolled state update if mobile menu is open
      if (isOpenRef.current) return
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, []) // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        /* Apply scrolled styles if scrolled OR mobile menu is open */
        (scrolled || isOpen) ? "bg-black/80 backdrop-blur-md border-b border-zinc-800/50 py-3" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="relative z-10">
          <div className="flex items-center gap-2">
            {/* Updated font class here */}
            <span className="text-5xl font-bold bg-clip-text text-gray-300 font-poppins">
              Dripez
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/w2c">Produkty</NavLink>
          <NavLink href="/how-to">Jak Zamawiać</NavLink>
          <NavLink href="/converter">Konwerter</NavLink>
          <NavLink href="/tracking">Śledzenie</NavLink>
          <NavLink href="/qc">Zdjęcia QC</NavLink>
          <NavLink href="/sellers">Sprzedawcy</NavLink>
          <NavLink href="https://discord.com/invite/Bx8ddZTD28">Discord</NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden relative z-10 w-10 h-10 flex items-center justify-center text-white/90 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu" // Added aria-label for accessibility
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 h-screen bg-black/95 flex flex-col justify-center items-center transition-all duration-300 md:hidden z-40", // z-index adjusted to be below header's z-10 elements when closed, but still high
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <nav className="flex flex-col items-center gap-6 text-xl">
            <MobileNavLink href="/w2c" onClick={() => setIsOpen(false)}>
              Produkty
            </MobileNavLink>
            <MobileNavLink href="/how-to" onClick={() => setIsOpen(false)}>
              Jak Zamawiać
            </MobileNavLink>
            <MobileNavLink href="/converter" onClick={() => setIsOpen(false)}>
              Konwerter
            </MobileNavLink>
            <MobileNavLink href="/tracking" onClick={() => setIsOpen(false)}>
              Śledzenie
            </MobileNavLink>
            <MobileNavLink href="/qc" onClick={() => setIsOpen(false)}>
              Zdjęcia QC
            </MobileNavLink>
            <MobileNavLink href="/sellers" onClick={() => setIsOpen(false)}>
              Sprzedawcy
            </MobileNavLink>
            <MobileNavLink href="https://discord.com/invite/Bx8ddZTD28" onClick={() => setIsOpen(false)}>
              Discord
            </MobileNavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Desktop Navigation Link Component
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-white/70 hover:text-white transition-colors font-medium text-sm group"
    >
      {children}
      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-rose-500 group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300"></span>
    </Link>
  )
}

// Mobile Navigation Link Component
function MobileNavLink({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick} // Ensure onClick is passed and used
      className="relative text-white/80 hover:text-white transition-colors font-medium group"
    >
      {children}
      <span className="block h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-300 mt-1"></span>
    </Link>
  )
}
