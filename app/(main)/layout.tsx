import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header"
import { auth, signOut } from "@/auth"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default async function Page({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader session={session} />
        <div className="flex flex-1">
          <AppSidebar session={session} />
          <SidebarInset>
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
