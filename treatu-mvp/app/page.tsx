import BusinessLoginForm from "@/components/BusinessLoginForm";
import BusinessSignupForm from "@/components/BusinessSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";

import WaitlistForm from "@/components/WaitlistForm";


export default function Home() {
  return (
    <>
      <Navigation />
      <main className="">
        <section className="">
        <h2>KBH's SELFCARE PLATFORM</h2>
        <h2>Welcome Back!</h2>
          <h1>Log ind</h1>
          <BusinessLoginForm />
          <p>eller</p>
          <a>Tilmeld din virksomhed i dag!</a>
          <div>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Web?</a>
          </div>
        </section>
      </main>
    </>
  );
}