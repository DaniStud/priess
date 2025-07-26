"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"; // Adjust import if needed
import { Button } from "@/components/ui/button";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "success" | "error" | "duplicate">(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else if (res.status === 409) {
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={submit}>
      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Join waitlist"}
      </Button>
      {status === "success" && <p className="text-green-600">Thank you! You are now on the waitlist.</p>}
      {status === "duplicate" && <p className="text-yellow-600">This email is already registered.</p>}
      {status === "error" && <p className="text-red-600">Something went wrong. Please try again.</p>}
    </form>
  );
}