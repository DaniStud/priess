"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { CalendarDays, Bell, Settings, LogOut, User, HelpCircle, Home } from "lucide-react";
import Link from "next/link";

export default function AppSidebar() {
  return (
    <Sidebar
      className="bg-[#482e6e] text-white w-[260px] min-w-[220px] max-w-[300px] flex flex-col justify-between h-screen"
      variant="sidebar"
      collapsible="none"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* Firm name at top */}
        <div className="px-8 pt-10 pb-6">
          <span className="font-extrabold text-2xl tracking-tight">TreatU DK</span>
        </div>
        <SidebarMenu className="flex flex-col gap-2 px-4">
          <SidebarMenuItem>
            <Link href="/dashboard">
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-3 text-base hover:bg-[#5e3e93] rounded-lg transition">
                <Home size={20} /> Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/calendar">
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-3 text-base hover:bg-[#5e3e93] rounded-lg transition">
                <CalendarDays size={20} /> Kalender & tider
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/notifications">
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-3 text-base hover:bg-[#5e3e93] rounded-lg transition">
                <Bell size={20} /> Notifikationer
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/settings">
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-3 text-base hover:bg-[#5e3e93] rounded-lg transition">
                <Settings size={20} /> Indstillinger
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/logout">
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-3 text-base hover:bg-[#5e3e93] rounded-lg transition">
                <LogOut size={20} /> Logout
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      {/* Push footer to bottom */}
      <SidebarFooter className="flex flex-col gap-4 px-8 pb-6 mt-auto">
        <div className="flex items-center gap-3 py-2">
          <User size={20} />
          <span className="text-base">Min konto</span>
        </div>
        <div className="flex items-center gap-3 py-2">
          <HelpCircle size={20} />
          <span className="text-base">Hjælp</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}