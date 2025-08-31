
"use client";
import BusinessLoginForm from "@/components/BusinessLoginForm";
import BusinessSignupForm from "@/components/BusinessSignupForm";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useState } from "react";


export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [signupStep, setSignupStep] = useState("signup");
  return (
    <>
      <main
        className="overflow-auto bg-[url('/image/70procent.png')] bg-no-repeat bg-left bg-[length:auto_130vh]"
      >
        <Navigation />
        <div className="flex justify-between ml-[10vw] max-w-[80vw]">
          <section>
            <div className="hidden lg:flex flex-col items-center justify-center text-6xl h-full">
              <div>
                <h2
                  className="font-extrabold text-7xl text-center drop-shadow-[4px_4px_0_rgba(120,120,120,0.7)]"
                >
                  KBH'S SELFCARE<br />PLATFORM
                </h2>
              </div>
              <div>
                <h2 className="pt-60 font-extrabold text-6xl">Velkommen tilbage!</h2>
              </div>
            </div>
          </section>

          <section>
            <div className="card p-10 pb-20 rounded-[40px] ml-[0vw] sm:ml-[5vw] min-w-[80vw] sm:min-w-[500px] sm:min-h-[85vh] max-w-[200px]">
              <h1 className="mb-16 mt-20 md:text-6xl">{showSignup ? "Tilmeld din forretning nu!" : "Log ind"}</h1>
              {showSignup ? <BusinessSignupForm step={signupStep} setStep={setSignupStep} /> : <BusinessLoginForm />}
              <div className="flex items-center my-6">
                <hr className="flex-1 border-t border-gray-300" />
                <span className="mx-4 text-gray-500">eller</span>
                <hr className="flex-1 border-t border-gray-300" />
              </div>

              {/* Social icons only visible on initial signup/login step */}
              {(!showSignup || signupStep === "signup") && (
                <div className="flex justify-between max-w-[80%] m-auto mt-4 mb-8">
                  <div className="max-w-16">
                    <a href="#">
                      <img className="hover:transform hover:scale-105" src="/image/insta-1.png" alt="Instagram" />
                    </a>
                  </div>
                  <div className="max-w-16">
                    <a href="#">
                      <img className="hover:transform hover:scale-105" src="/image/fb-1.png" alt="Facebook" />
                    </a>
                  </div>
                  <div className="max-w-16">
                    <a href="#">
                      <img className="hover:transform hover:scale-105" src="/image/web-1.png" alt="Web" />
                    </a>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full mb-6 bg-gray-200 text-gray-700 hover:bg-gray-300 sm:pl-20 sm:pr-20"
                onClick={() => setShowSignup((prev) => !prev)}
              >
                {showSignup ? "Tilbage til login" : "Opret din virksomhed i dag!"}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}