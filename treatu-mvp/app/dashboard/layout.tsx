"use client";

import '../../../treatu-mvp/app/globals.css'
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { DashboardMobileNav } from "@/components/DashboardMobileNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Mobile nav trigger: only on mobile */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <DashboardMobileNav />
        </div>
        {/* Sidebar: hidden on mobile, visible on lg+ */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        {/* Main content: full width on mobile, with sidebar on desktop */}
        <main className="flex-1 w-full bg-gray-50 p-4 sm:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}