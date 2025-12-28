import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SideBar } from '@/components/SideBar'
import { SidebarProvider } from '@/components/ui/sidebar'

const RootLayout = () => (
  <SidebarProvider>
    <SideBar />
    <Outlet />
    <TanStackRouterDevtools />
  </SidebarProvider>
)

export const Route = createRootRoute({ component: RootLayout })