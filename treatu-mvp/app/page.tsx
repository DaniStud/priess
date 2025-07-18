import BusinessSignupForm from "@/components/BusinessSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import WaitlistForm from "@/components/WaitlistForm";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
            <section className="">
              <h1>Log ind</h1>
            <h2 className="text-xl font-semibold mb-2">Tilmeld Kunde (Venteliste)</h2>
            <WaitlistForm />
            <BusinessSignupForm />
            </section>
    </main>
  );
}