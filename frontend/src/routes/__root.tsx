import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SideBar } from '@/components/SideBar'
import { SidebarProvider } from '@/components/ui/sidebar'

const RootLayout = () => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full bg-background relative">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-chart-2/3 rounded-full blur-[120px] opacity-20" />
      </div>
      
      <SideBar />
      <main className="flex-1 flex flex-col min-h-screen">
        <Outlet />
      </main>
    </div>
    <TanStackRouterDevtools />
  </SidebarProvider>
)

export const Route = createRootRoute({ component: RootLayout })