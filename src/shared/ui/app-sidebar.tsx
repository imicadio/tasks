"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CodeXml } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

export type NavItem = {
  href: string;
  label: string;
  /** A pre-rendered icon element (e.g. `<CarFront className="size-4" />`) —
   * not a component reference, since this crosses a server→client prop
   * boundary and raw function/component references aren't serializable
   * there. */
  icon: ReactNode;
};

export function AppSidebar({
  navItems,
  repoUrl,
}: {
  navItems: NavItem[];
  repoUrl?: string;
}) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            N
          </div>
          <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
            NASK Dashboardy
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                        />
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
          <ThemeToggle />
          {repoUrl && (
            <SidebarMenuButton
              render={
                <Link href={repoUrl} target="_blank" rel="noopener noreferrer" />
              }
              tooltip="Kod źródłowy"
              className="w-auto"
            >
              <CodeXml className="size-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                Kod źródłowy
              </span>
            </SidebarMenuButton>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
