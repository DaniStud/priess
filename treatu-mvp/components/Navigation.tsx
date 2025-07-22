import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";

export default function Navigation() {
    return (
        <NavigationMenu className="flex justify-between ml-20 mt-10 md:max-w-[80vw] lg:max-w-[50vw] w-full">
            <NavigationMenuList className="hidden lg:flex justify-between" >
                <NavigationMenuItem className="text-4xl">TreatU DK</NavigationMenuItem>
                <NavigationMenuItem>HJEM</NavigationMenuItem>
                <NavigationMenuItem>OM OS</NavigationMenuItem>
                <NavigationMenuItem>KONTAKT</NavigationMenuItem>
                <NavigationMenuItem>TILMELD DIG</NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
