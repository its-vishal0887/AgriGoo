"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AgriGooLogo } from "@/components/agrigoo-logo"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: "Home", href: "/" },
		{ name: "Dashboard", href: "/dashboard" },
    { name: "Crop Detection", href: "/detection", target: "_blank" },
    { name: "Soil Health", href: "/soil-health" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <AgriGooLogo size="md" showTagline={true} />

          {/* Center Menu - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.target}
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative group py-2"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 py-2"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-3 min-h-[44px] min-w-[44px]">
                  <span className="text-gray-700 text-lg">☰</span>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </div>
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="pb-4 border-b border-primary/10">
                    <AgriGooLogo size="md" showTagline={true} />
                  </div>

                  {/* Mobile Menu Items */}
                  <nav className="flex flex-col space-y-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        target={item.target}
                        className="text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200 py-3 px-2 rounded-lg hover:bg-primary/5 min-h-[44px] flex items-center"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col space-y-3 pt-6 border-t border-primary/10">
                    <Link
                      href="/login"
                      className="text-center py-3 text-gray-700 hover:text-primary font-medium transition-colors duration-200 rounded-lg hover:bg-primary/5 min-h-[44px] flex items-center justify-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
