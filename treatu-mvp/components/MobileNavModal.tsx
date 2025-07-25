import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Menu } from "lucide-react";
import Navigation from "@/components/Navigation";

import { VisuallyHidden } from "@/components/ui/visually-hidden";

export default function MobileNavModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="block sm:hidden p-2 rounded-md border border-gray-300 bg-white">
          <Menu className="h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:hidden p-0 bg-white">
        <DialogTitle asChild>
          <VisuallyHidden>Navigation menu</VisuallyHidden>
        </DialogTitle>
        <div className="flex flex-col items-center gap-6 py-8">
          <Navigation />
        </div>
      </DialogContent>
    </Dialog>
  );
}
