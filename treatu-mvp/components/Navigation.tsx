import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { MobileNav } from "@/components/MobileNav"; // Import the mobile nav

export default function Navigation() {
    return (
        <nav className="flex justify-start ml-4 md:ml-20 mt-6 md:mt-10 md:max-w-[80vw] w-full">
            {/* Left: Logo/title, always visible */}
            <span className="text-3xl font-bold">TreatU DK</span>
            
            {/* Desktop navigation: visible on xl and up, hidden on tablet and smaller */}
            <NavigationMenu className="ml-20 hidden xl:flex flex-1 justify-between">
                <NavigationMenuList className="flex gap-20">
                    <NavigationMenuItem className="text-xl">HOME</NavigationMenuItem>
                    <NavigationMenuItem className="text-xl">ABOUT US</NavigationMenuItem>
                    <NavigationMenuItem className="text-xl">CONTACT</NavigationMenuItem>
                    <NavigationMenuItem className="text-xl">SIGN UP</NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            
            {/* Mobile navigation: visible below lg, hides desktop nav */}
            <div className="flex xl:hidden mr-10">
                <MobileNav />
            </div>
        </nav>
    );
}