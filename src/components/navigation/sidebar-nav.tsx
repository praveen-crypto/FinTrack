"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PiggyBank } from "lucide-react"

import { cn } from "@/lib/utils"
import { navItems, type NavItem } from "@/config/nav"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <div className={cn("flex items-center gap-2", open ? "" : "justify-center")}>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
            <PiggyBank className="h-6 w-6" />
          </Button>
          <h1 className={cn("text-xl font-semibold tracking-tight font-headline", open ? "" : "hidden")}>
            FinPower
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                tooltip={{
                  children: item.title,
                  className: "group-data-[collapsible=icon]:flex hidden",
                }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                  {item.label && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {item.label}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Separator className="my-2" />
        <div className={cn("flex items-center gap-2", open ? "" : "justify-center")}>
           <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
            <AvatarFallback>FP</AvatarFallback>
          </Avatar>
          <div className={cn("flex flex-col", open ? "" : "hidden")}>
            <span className="text-sm font-medium">FinPower User</span>
            <span className="text-xs text-muted-foreground">user@example.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
