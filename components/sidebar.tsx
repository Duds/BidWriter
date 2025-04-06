"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, FileText, Settings, FolderPlus, Cloud, BarChart2, Zap, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps {
  isOpen: boolean
  isMobile: boolean
}

export function Sidebar({ isOpen, isMobile }: SidebarProps) {
  const pathname = usePathname()

  const mainNavItems = [
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
      name: "Analytics",
      href: "/analytics",
      icon: BarChart2,
    },
  ]

  const utilityNavItems = [
    {
      name: "Cloud Storage",
      href: "/settings/cloud-storage",
      icon: Cloud,
    },
    {
      name: "AI Models",
      href: "/settings/ai-models",
      icon: Zap,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  if (!isOpen) {
    return null
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r transition-transform duration-300 ease-in-out",
        isMobile ? "transform translate-x-0" : "",
        !isOpen && "transform -translate-x-full",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400"></div>
            <div className="absolute inset-[2px] rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">B</span>
            </div>
          </div>
          <span className="font-semibold text-xl">BidWriter</span>
        </Link>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="px-3 py-4">
          <div className="mb-4">
            <h2 className="px-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Main</h2>
            <nav className="mt-2 space-y-1">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="mb-4">
            <h2 className="px-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Utilities</h2>
            <nav className="mt-2 space-y-1">
              {utilityNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="mt-6">
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-sm">Pro Features</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Upgrade to access advanced AI models, unlimited templates, and more.
              </p>
              <Button size="sm" className="mt-3 w-full">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

