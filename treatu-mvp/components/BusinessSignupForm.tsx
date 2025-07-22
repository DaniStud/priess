"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BusinessSignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error" | "duplicate" | "password-mismatch">(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (form.password !== confirmPassword) {
      setStatus("password-mismatch");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/business/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("success");
      setTimeout(() => router.push("/business/login"), 1500);
    }
    else if (res.status === 409) setStatus("duplicate");
    else setStatus("error");

    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-2 max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
      <Input name="name" placeholder="Virksomhedsnavn" value={form.name} onChange={handleChange} required />
      <Input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <div className="flex gap-2">
        <Input className="w-1/2" type="password" name="password" placeholder="Adgangskode" value={form.password} onChange={handleChange} required />
        <Input className="w-1/2" type="password" name="confirmPassword" placeholder="Bekræft adgangskode" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Opretter..." : "Opret virksomhed"}</Button>
      {status === "password-mismatch" && <p className="text-red-600">Adgangskoderne matcher ikke.</p>}
      {status === "success" && <p className="text-green-600">Virksomhed oprettet! Du videresendes til login.</p>}
      {status === "duplicate" && <p className="text-yellow-600">Denne email er allerede oprettet.</p>}
      {status === "error" && <p className="text-red-600">Noget gik galt. Prøv igen.</p>}
    </form>
  );
}