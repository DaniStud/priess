"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type Step = "signup" | "business-type" | "services" | "salon-name" | "address" | "done";

const SERVICES = {
  "hair salon": [
    "Dame Klip",
    "Herre klip",
    "Bryn",
    "Vipper",
    "Braids",
    "Skæg",
    "Ekstentions",
    "Perm",
    "Styling",
    "Hud behandlinger",
    "Negle",
    "Hårfjerning",
    "Børne klip",
  ],
  "beauty salon": [
    "Dame Klip",
    "Herre klip",
    "Bryn",
    "Vipper",
    "Braids",
    "Skæg",
    "Ekstentions",
    "Perm",
    "Styling",
    "Hud behandlinger",
    "Negle",
    "Hårfjerning",
    "Børne klip",
  ],
  "nail salon": [
    "Dame Klip",
    "Herre klip",
    "Bryn",
    "Vipper",
    "Braids",
    "Skæg",
    "Ekstentions",
    "Perm",
    "Styling",
    "Hud behandlinger",
    "Negle",
    "Hårfjerning",
    "Børne klip",
  ],
};

type BusinessSignupFormProps = {
  step: Step;
  setStep: (step: Step) => void;
};

export default function BusinessSignupForm({ step, setStep }: BusinessSignupFormProps) {

  // Signup fields
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error" | "duplicate" | "password-mismatch">(null);

  // Step 2: business type
  const [businessType, setBusinessType] = useState<string>("");
  // Step 3: services selection
  const [services, setServices] = useState<string[]>([]);

  // New: salon name
  const [salonName, setSalonName] = useState("");

  // Step 4: address
  const [address, setAddress] = useState({
    address: "",
    city: "",
    zipCode: "",
    country: "Danmark",
  });

  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  // Step 1 submit: go to business type choice
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (form.password !== confirmPassword) {
      setStatus("password-mismatch");
      return;
    }
    setStep("business-type");
  };

  // Step 2 submit: go to service selection
  const handleBusinessTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessType) return;
    setStep("services");
  };

  // Step 3 submit: go to salon name input
  const handleServicesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!services.length) return;
    setStep("salon-name");
  };

  // Step 3.5: salon name submit handler
  const handleSalonNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonName.trim()) return;
    setStep("address");
  };

  // Step 4 submit: send all data to backend
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Extra validation for address
    if (!address.address || !address.city || !address.zipCode) return;

    setLoading(true);

    const res = await fetch("/api/business/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        businessType,
        services,
        salonName,
        salonAddress: address,
      }),
    });

    if (res.ok) {
      setStatus("success");
      setStep("done");
      setTimeout(() => router.push("/business/login"), 1800);
    } else if (res.status === 409) setStatus("duplicate");
    else setStatus("error");

    setLoading(false);
  };

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  // Step back handlers
  const handleBackFromBusinessType = () => setStep("signup");
  const handleBackFromServices = () => setStep("business-type");
  const handleBackFromSalonName = () => setStep("services");
  const handleBackFromAddress = () => setStep("salon-name");

  return (
    <div>
      {step === "signup" && (
        <form className="flex flex-col gap-2 max-w-md mx-auto mt-8" onSubmit={handleSignupSubmit}>
          <Input name="name" placeholder="Forretningsnavn " value={form.name} onChange={handleChange} required />
          <Input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
          <div className="flex gap-2">
            <Input className="w-1/2" type="password" name="password" placeholder="Adgangskode" value={form.password} onChange={handleChange} required />
            <Input className="w-1/2" type="password" name="confirmPassword" placeholder="Bekræft adgangskode" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
          </div>
          <Button className="rounded-full" type="submit" disabled={loading}>
            {loading ? "Opretter..." : "Næste"}
          </Button>
          {status === "password-mismatch" && <p className="text-red-600">Adgangskoderne matcher ikke.</p>}
        </form>
      )}

      {step === "business-type" && (
        <form className="flex flex-col gap-4 max-w-md mx-auto mt-8" onSubmit={handleBusinessTypeSubmit}>
          <label className="mb-2 font-semibold text-lg">Vælg din virksomhedstype</label>
          <Select value={businessType} onValueChange={setBusinessType} required>
            <SelectTrigger>
          <SelectValue placeholder="Vælg type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nail salon">Neglesalon</SelectItem>
              <SelectItem value="hair salon">Frisørsalon</SelectItem>
              <SelectItem value="beauty salon">Skønhedssalon</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button className="rounded-full" type="button" onClick={handleBackFromBusinessType}>
              Tilbage
            </Button>
            <Button className="rounded-full" type="submit" disabled={loading || !businessType}>
              {loading ? "Fortsætter..." : "Næste"}
            </Button>
          </div>
        </form>
      )}

      {step === "services" && (
        <form className="flex flex-col gap-4 max-w-md mx-auto mt-8" onSubmit={handleServicesSubmit}>
          <h1 className="text-2xl font-bold mb-4">Hvilke tjenester tilbyder I?</h1>
          <div className="flex flex-col gap-2 mb-4">
            {(SERVICES[businessType as keyof typeof SERVICES] || []).map((service) => (
              <label key={service} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={services.includes(service)}
                  onCheckedChange={() => toggleService(service)}
                  id={service}
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <Button className="rounded-full" type="button" onClick={handleBackFromServices}>
              Tilbage
            </Button>
            <Button className="rounded-full" type="submit" disabled={loading || !services.length}>
              {loading ? "Fortsætter..." : "Næste"}
            </Button>
          </div>
          {status === "duplicate" && <p className="text-yellow-600">Denne e-mail er allerede registreret.</p>}
          {status === "error" && <p className="text-red-600">Noget gik galt. Prøv igen.</p>}
        </form>
      )}

      {step === "salon-name" && (
        <form className="flex flex-col gap-4 max-w-md mx-auto mt-8" onSubmit={handleSalonNameSubmit}>
          <h1 className="text-2xl font-bold mb-4">Salonnavn</h1>
          <Input
            name="salonName"
            placeholder="Navn på salon"
            value={salonName}
            onChange={e => setSalonName(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Button className="rounded-full" type="button" onClick={handleBackFromSalonName}>
              Tilbage
            </Button>
            <Button className="rounded-full" type="submit" disabled={loading || !salonName.trim()}>
              {loading ? "Fortsætter..." : "Næste"}
            </Button>
          </div>
        </form>
      )}

      {step === "address" && (
        <form className="flex flex-col gap-4 max-w-md mx-auto mt-8" onSubmit={handleAddressSubmit}>
          <h1 className="text-2xl font-bold mb-4">Hvor ligger din salon?</h1>
          <Input
            name="address"
            placeholder="Adresse (f.eks. Hovedgade 1)"
            value={address.address}
            onChange={e => setAddress(a => ({ ...a, address: e.target.value }))}
            required
          />
          <div className="flex gap-2">
            <Input
              name="zipCode"
              placeholder="Postnummer"
              value={address.zipCode}
              onChange={e => setAddress(a => ({ ...a, zipCode: e.target.value }))}
              required
            />
            <Input
              name="city"
              placeholder="By"
              value={address.city}
              onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
              required
            />
          </div>
          <Input
            name="country"
            placeholder="Land"
            value={address.country}
            onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
            required
          />
          <div className="flex gap-2">
            <Button className="rounded-full" type="button" onClick={handleBackFromAddress}>
              Tilbage
            </Button>
            <Button className="rounded-full" type="submit" disabled={loading || !address.address || !address.city || !address.zipCode || !address.country}>
              {loading ? "Opretter..." : "Opret virksomhed"}
            </Button>
          </div>
          {status === "duplicate" && <p className="text-yellow-600">Denne e-mail er allerede registreret.</p>}
          {status === "error" && <p className="text-red-600">Noget gik galt. Prøv igen.</p>}
        </form>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <p className="text-green-600">Virksomhed oprettet! Du bliver omdirigeret til login.</p>
        </div>
      )}
    </div>
  );
}