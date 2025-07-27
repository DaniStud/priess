"use client";

import '../../../treatu-mvp/app/globals.css'
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full bg-gray-50 p-8">{children}
        </main>
      </div>
    </SidebarProvider>
  );
}