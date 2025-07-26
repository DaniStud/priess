
"use client";
import BusinessLoginForm from "@/components/BusinessLoginForm";
import BusinessSignupForm from "@/components/BusinessSignupForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WaitlistForm from "@/components/WaitlistForm";
import Navigation from "@/components/Navigation";
import { useState } from "react";


export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  return (
    <>
      <main className="">
        <Navigation/>
        <div className="flex justify-between ml-[10vw] max-w-[80vw]">
          <section>
            <div className="hidden lg:flex flex-col items-center justify-center text-6xl h-full">
              <div>
                <h2>CPH's SELFCARE PLATFORM</h2>
              </div>
              <div>
                <h2 className="pt-60">Welcome Back!</h2>
              </div>
            </div>
          </section>

          <section>
            <div className="card p-10 pb-20 rounded-lg ml-[0vw] sm:ml-[5vw] min-w-[80vw] sm:min-w-[500px] sm:min-h-[85vh]">
              <h1 className="mb-32 mt-20">{showSignup ? "Sign up" : "Log in"}</h1>
              {showSignup ? <BusinessSignupForm /> : <BusinessLoginForm />}
              <div className="flex items-center my-6">
                <hr className="flex-1 border-t border-gray-300" />
                <span className="mx-4 text-gray-500">or</span>
                <hr className="flex-1 border-t border-gray-300" />
              </div>
              <Button
                variant="outline"
                className="w-full mb-6 bg-gray-200 text-gray-700 hover:bg-gray-300 sm:pl-20 sm:pr-20"
                onClick={() => setShowSignup((prev) => !prev)}
              >
                {showSignup ? "Back to login" : "Sign up your business today!"}
              </Button>
              <div className="flex justify-between mt-10">
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
                <a href="#">Web?</a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}