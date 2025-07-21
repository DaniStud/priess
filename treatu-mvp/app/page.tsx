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
        
        <section className="flex mt-[10vh] justify-between ml-[10vw] max-w-[80vw]">

          <div className="hidden sm:block">
            <h2>KBH's SELFCARE PLATFORM</h2>
            <h2>Welcome Back!</h2>
          </div>

            <div className="card p-10 pb-20 rounded-lg ml-[5vw] max-w-[90vw] sm:max-w-[60vw]">
            <h1 className="mb-32">Log ind</h1>
            <BusinessLoginForm />
            <div className="flex items-center my-6">
              <hr className="flex-1 border-t border-gray-300" />
              <span className="mx-4 text-gray-500">eller</span>
              <hr className="flex-1 border-t border-gray-300" />
            </div>
            <Button variant="outline" className="w-full mb-6 bg-gray-200 text-gray-700 hover:bg-gray-300" asChild>
              <a href="/signup">Tilmeld din virksomhed i dag!</a>
            </Button>
            <div className="flex justify-between mt-10">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">Web?</a>
            </div>
            </div>
        </section>
      </main>
    </>
  );
}