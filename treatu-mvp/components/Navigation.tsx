import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";

export default function Navigation() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>TreatU DK</NavigationMenuItem>
                <NavigationMenuItem>HJEM</NavigationMenuItem>
                <NavigationMenuItem>OM OS</NavigationMenuItem>
                <NavigationMenuItem>KONTAKT</NavigationMenuItem>
                <NavigationMenuItem>TILMELD DIG</NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
