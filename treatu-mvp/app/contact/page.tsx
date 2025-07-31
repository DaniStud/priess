"use client";
import Navigation from "@/components/Navigation";
import BusinessLoginForm from "@/components/BusinessLoginForm";
import BusinessSignupForm from "@/components/BusinessSignupForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Contact() {
  const [showSignup, setShowSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSent(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setErrorMsg("Noget gik galt. Prøv igen.");
      }
    } catch {
      setErrorMsg("Noget gik galt. Prøv igen.");
    }
    setLoading(false);
  };

  return (
    <>
      <main className="">
        <Navigation/>
        <div className="flex justify-between ml-[10vw] max-w-[80vw]">
          <section>
            <div className="hidden lg:flex flex-col items-center justify-center text-6xl h-full">
              <div>
                {/* <h2>CPH's SELFCARE PLATFORM</h2> */}
              </div>
              <div>
                {/* <h2 className="pt-60">Kontakt os i dag!</h2> */}
              </div>
            </div>
          </section>

          <section>
            <form onSubmit={handleSubmit} className="card p-10 pb-10 rounded-[40px] ml-[0vw] sm:ml-[5vw] min-w-[80vw] max-w-[80vw] sm:min-w-[500px] sm:min-h-[85vh] bg-white flex flex-col">
              <h1 className="mb-10 mt-2 text-4xl font-black">Kontakt os i dag!</h1>
              <label className="text-base font-medium mb-1 mt-2" htmlFor="name">Forretningsnavn</label>
              <input
                id="name"
                name="name"
                type="text"
                className="mb-4 px-6 py-2 rounded-full bg-gray-200 focus:outline-none text-lg"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <label className="text-base font-medium mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="mb-4 px-6 py-2 rounded-full bg-gray-200 focus:outline-none text-lg"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <label className="text-base font-medium mb-1" htmlFor="message">Besked</label>
              <textarea
                id="message"
                name="message"
                className="mb-6 px-6 py-2 rounded-3xl bg-gray-200 focus:outline-none text-lg min-h-[120px] resize-none"
                value={form.message}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-black text-white rounded-full py-3 text-lg font-semibold mb-4 mt-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Sender..." : "Send mail"}
              </button>
              {sent && <div className="text-green-600 text-center mb-2">Tak for din besked!</div>}
              {errorMsg && <div className="text-red-500 text-center mb-2">{errorMsg}</div>}
              <div className="flex items-center my-4">
                <hr className="flex-1 border-t border-gray-300" />
                <hr className="flex-1 border-t border-gray-300" />
              </div>

            </form>
          </section>
        </div>
      </main>
    </>
  );
}
