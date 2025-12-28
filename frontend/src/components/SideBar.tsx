import { IconFlame, IconHome2, IconChartBar, IconSettings, IconMoon } from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: IconHome2,
  },
  {
    title: "Statistics",
    url: "/stats",
    icon: IconChartBar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
]

export function SideBar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-sidebar-border/50">
      <SidebarHeader className="p-4 pb-2">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-chart-2 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <IconFlame className="w-6 h-6 text-white" stroke={2} />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-accent to-chart-2 blur-lg opacity-40 -z-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-gradient">
              Streaks
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
              Hack Your Brains Dopamine Addiction!
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-11 px-3 rounded-lg transition-all duration-200",
                        "hover:bg-sidebar-accent/50",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon 
                          className={cn(
                            "w-5 h-5 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )} 
                          stroke={isActive ? 2 : 1.5}
                        />
                        <span className={cn(
                          "font-medium",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2">
        {/* Theme toggle hint */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-sidebar-accent/30 border border-sidebar-border/50">
          <div className="flex items-center gap-2">
            <IconMoon className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Dark Mode</span>
          </div>
          <div className="w-8 h-4 rounded-full bg-primary/20 flex items-center justify-end px-0.5">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
