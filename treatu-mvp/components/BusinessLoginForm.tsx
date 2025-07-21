"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BusinessLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorMsg(null);

    const res = await fetch("/api/business/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setStatus("success");
      window.location.href = "/dashboard";
    } else {
      setStatus("error");
      const { error } = await res.json();
      setErrorMsg(error || "Noget gik galt. Prøv igen.");
    }
    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={submit}>
      <Input
        type="email"
        placeholder="Din email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Adgangskode"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <Button className="mt-10" type="submit" disabled={loading}>
        {loading ? "Logger ind..." : "Log ind"}
      </Button>
      {status === "success" && <p className="text-green-600">Du er nu logget ind!</p>}
      {status === "error" && <p className="text-red-600">{errorMsg}</p>}
    </form>
  );
}