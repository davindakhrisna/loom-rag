"use client"

import { SidebarIcon } from "lucide-react"
import { usePathname } from "next/navigation";
import { Session } from "next-auth"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

const PATH_TITLES = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/profile': 'Profile',
  '/dashboard/notes': 'Notes',
  '/community': 'Community',
  '/mistral': 'Ask Mistral',
  '/documentation': 'Documentation',
  '/pomodoro': 'Pomodoro',
} as const;

type PathTitles = typeof PATH_TITLES;
type ValidPath = keyof PathTitles;

export function SiteHeader({ session }: { session: Session | null }) {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname();
  const getSafeTitle = (path: string): string => {
    // Runtime check with type safety
    if (Object.prototype.hasOwnProperty.call(PATH_TITLES, path)) {
      return PATH_TITLES[path as ValidPath];
    }
    return 'Page';
  };

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              {session?.user?.name || "Main"}&apos;s Workspace
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{getSafeTitle(pathname)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
