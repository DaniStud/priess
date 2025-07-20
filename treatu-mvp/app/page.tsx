import BusinessLoginForm from "@/components/BusinessLoginForm";
import BusinessSignupForm from "@/components/BusinessSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WaitlistForm from "@/components/WaitlistForm";
import Navigation from "@/components/Navigation";


export default function Home() {
  return (
    <>
      <main className="">
        <Navigation />
        
        <section className="card">
        <Button >Lorem</Button>
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