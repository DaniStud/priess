import * as React from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Menu className="w-8 h-8" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SheetHeader className="px-6 py-4 border-b">
          <span className="font-bold text-2xl">TreatU DK</span>
        </SheetHeader>
        <nav className="flex flex-col gap-6 p-6 text-lg">
          <SheetClose asChild>
            <Link href="/">HJEM</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/contact">KONTAKT</Link>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}