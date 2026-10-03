import { Bus, CarFront, CloudSun, Waves } from "lucide-react";
import { AppSidebar, type NavItem } from "@/shared/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/ui/sidebar";
import { Separator } from "@/shared/ui/separator";

const NAV_ITEMS: NavItem[] = [
  {
    href: "/road-accidents",
    label: "Wypadki drogowe",
    icon: <CarFront className="size-4" />,
  },
  {
    href: "/hydrologia",
    label: "Hydrologia",
    icon: <Waves className="size-4" />,
  },
  {
    href: "/pogoda",
    label: "Pogoda",
    icon: <CloudSun className="size-4" />,
  },
  {
    href: "/transport",
    label: "Transport publiczny",
    icon: <Bus className="size-4" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Przejdź do treści głównej
      </a>
      <AppSidebar
        navItems={NAV_ITEMS}
        repoUrl="https://github.com/imicadio/NASK"
      />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-muted-foreground">
            Dashboardy danych publicznych
          </span>
        </header>
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
