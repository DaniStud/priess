import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { MobileNav } from "@/components/MobileNav"; // Import the mobile nav

export default function Navigation() {
    return (
        <nav className="flex justify-start ml-4 md:ml-20 mt-6 md:mt-10 md:max-w-[80vw] w-full">
            {/* Left: Logo/title, always visible */}
            <Link href="/" className="text-3xl font-bold">
                TreatU DK
            </Link>
            
            {/* Desktop navigation: visible on xl and up, hidden on tablet and smaller */}
            <NavigationMenu className="ml-20 hidden xl:flex flex-1 justify-between">
                <NavigationMenuList className="flex gap-20">
                    <NavigationMenuItem className="text-xl bg-black/10 rounded-md px-4 py-2 transition-transform duration-200 hover:scale-110">
                        <Link href="/">HJEM</Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="text-xl bg-black/10 rounded-md px-4 py-2 transition-transform duration-200 hover:scale-110">
                        <Link href="/contact">KONTAKT</Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            
            {/* Mobile navigation: visible below lg, hides desktop nav */}
            <div className="flex xl:hidden mr-10 ml-auto justify-end">
                <MobileNav />
            </div>
        </nav>
    );
}