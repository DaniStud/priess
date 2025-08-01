import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
} from "@/components/ui/sheet";
import { Menu, Home, CalendarDays, Bell, Settings, LogOut, User, HelpCircle } from "lucide-react";
import Link from "next/link";

export function DashboardMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary lg:hidden bg-white border border-gray-300"
        >
          <Menu className="w-8 h-8 text-[#482e6e]" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-[#482e6e] text-white">
        <SheetHeader className="px-6 py-4 border-b border-[#5e3e93]">
          <span className="font-extrabold text-2xl tracking-tight">TreatU DK</span>
        </SheetHeader>
        <nav className="flex flex-col gap-2 p-6 text-base">
          <SheetClose asChild>
            <Link href="/dashboard" className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-[#5e3e93] transition">
              <Home size={20} /> Dashboard
            </Link>
          </SheetClose>
          <div className="relative group">
            <button className="flex items-center gap-3 py-3 px-3 rounded-lg opacity-40 pointer-events-none w-full">
              <CalendarDays size={20} /> Calendar & times
            </button>
            <div className="absolute inset-0 flex items-center justify-center bg-[#482e6e]/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold text-white px-2 py-1 rounded opacity-80">Kommer snart</span>
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-3 py-3 px-3 rounded-lg opacity-40 pointer-events-none w-full">
              <Bell size={20} /> Notifications
            </button>
            <div className="absolute inset-0 flex items-center justify-center bg-[#482e6e]/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold text-white px-2 py-1 rounded opacity-80">Kommer snart</span>
            </div>
          </div>
          <SheetClose asChild>
            <Link href="/dashboard/settings" className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-[#5e3e93] transition">
              <Settings size={20} /> Settings
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/logout" className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-[#5e3e93] transition">
              <LogOut size={20} /> Logout
            </Link>
          </SheetClose>
        </nav>
        <div className="flex flex-col gap-4 px-6 pb-6 mt-auto">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
