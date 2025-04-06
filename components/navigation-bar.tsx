"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, FileText, Settings, FolderPlus, Cloud } from "lucide-react"
import { MobileNavigation } from "./mobile-navigation"

export function NavigationBar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderPlus,
    },
    {
      name: "Templates",
      href: "/templates",
      icon: FileText,
    },
    {
      name: "Cloud Storage",
      href: "/settings/cloud-storage",
      icon: Cloud,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 py-2 px-4 mb-6">
      <div className="container mx-auto flex items-center justify-between">
        <MobileNavigation />
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium py-2 px-1 border-b-2 transition-colors",
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

