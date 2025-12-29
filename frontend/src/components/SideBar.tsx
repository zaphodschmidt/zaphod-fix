import { IconFlame, IconHome2, IconChartBar, IconSettings, IconMoon, IconSun } from "@tabler/icons-react"
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
import { useTheme } from "@/hooks/use-theme"

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
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

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
              Zaphod's Fix
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
                      render={<Link to={item.url} />}
                      isActive={isActive}
                      className={cn(
                        "h-11 px-3 rounded-lg transition-all duration-200",
                        "hover:bg-sidebar-accent/50",
                        isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      )}
                    >
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
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-sidebar-accent/30 border border-sidebar-border/50 hover:bg-sidebar-accent/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {isDark ? (
              <IconMoon className="w-4 h-4 text-muted-foreground" />
            ) : (
              <IconSun className="w-4 h-4 text-amber-500" />
            )}
            <span className="text-xs text-muted-foreground">
              {isDark ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
          
          {/* Toggle switch */}
          <div 
            className={cn(
              "w-9 h-5 rounded-full flex items-center px-0.5 transition-colors",
              isDark ? "bg-primary/20 justify-end" : "bg-amber-500/20 justify-start"
            )}
          >
            <div 
              className={cn(
                "w-4 h-4 rounded-full transition-colors",
                isDark ? "bg-primary" : "bg-amber-500"
              )} 
            />
          </div>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
