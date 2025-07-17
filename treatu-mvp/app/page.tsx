import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import WaitlistForm from "@/components/WaitlistForm";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to the App Router!</h1>
      <p className="mt-4 text-lg text-gray-700">Edit <code>app/page.tsx</code> to get started.</p>
            <Button>Test Button</Button>
            <Input></Input>

            <section>
            <h2 className="text-xl font-semibold mb-2">Tilmeld Kunde (Venteliste)</h2>
            <WaitlistForm />
            </section>
    </main>
  );
}