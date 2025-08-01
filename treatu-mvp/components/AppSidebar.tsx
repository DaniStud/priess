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
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-3 text-base rounded-lg transition">
                <Home size={20} /> Oversigt
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="relative group">
              <Link href="#">
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-3 text-base rounded-lg transition opacity-40 pointer-events-none">
                <CalendarDays size={20} /> Kalender & tider
              </SidebarMenuButton>
              </Link>
              <div className="absolute inset-0 flex items-center justify-center bg-[#482e6e]/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold text-white px-2 py-1 rounded opacity-80">Kommer snart</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="relative group">
            <Link href="#">
              <SidebarMenuButton className="flex opacity-40 items-center gap-3 py-3 px-3 text-base rounded-lg transition">
                <Bell size={20} /> Notifikationer
              </SidebarMenuButton>
            </Link>
                          <div className="absolute inset-0 flex items-center justify-center bg-[#482e6e]/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold text-white px-2 py-1 rounded opacity-80">Kommer snart</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/settings">
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-3 text-base rounded-lg transition">
                <Settings size={20} /> Indstillinger
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/logout">
              <SidebarMenuButton className="flex items-center gap-3 py-3 px-3 text-base rounded-lg transition">
                <LogOut size={20} /> Log ud
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      {/* Push footer to bottom */}
      <SidebarFooter className="flex flex-col gap-4 px-8 pb-6 mt-auto">
        <div className="relative group">
          <div className="flex items-center gap-3 py-2">
            <User size={20} />
            <span className="text-base opacity-40">Min konto</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-[#482e6e]/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-semibold text-white px-2 py-1 rounded opacity-80">Kommer snart</span>
          </div>
        </div>
        <div className="relative group">
          <div className="flex items-center gap-3 py-2">
            <HelpCircle size={20} />
            <span className="text-base opacity-40">Hjælp</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-[#482e6e]/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-semibold text-white px-2 py-1 rounded opacity-80">Kommer snart</span>
          </div>
        </div>
        
      </SidebarFooter>
    </Sidebar>
  );
}


