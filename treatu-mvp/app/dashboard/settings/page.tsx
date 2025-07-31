
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  const [salonName, setSalonName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [salonId, setSalonId] = useState<number | null>(null);
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/business/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.salonId) {
          setSalonId(data.salonId);
          setSalonName(data.salonName || "");
          setEmail(data.email || "");
          setBusinessId(data.id || null);
        } else {
          setError("Salon not found");
        }
      })
      .catch(() => setError("Failed to fetch settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/business/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId,
          businessId,
          salonName,
          email,
          password: password || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update settings");
      }
      setSuccess("Indstillinger gemt!");
      setPassword("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-lg shadow text-card-foreground">
      <h2 className="text-2xl font-bold mb-8">Indstillinger</h2>
      {loading ? (
        <div>Indlæser...</div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-lg font-semibold mb-1 text-card-foreground">Salonnavn</h3>
            <input
              type="text"
              className="w-full border-b-2 border-black outline-none py-2 text-lg bg-transparent text-card-foreground"
              value={salonName}
              onChange={e => setSalonName(e.target.value)}
              placeholder="Salonnavn"
              required
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-1 text-card-foreground">Email adresse</h4>
            <input
              type="email"
              className="w-full border-b-2 border-black outline-none py-2 text-lg bg-transparent text-card-foreground"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-1 text-card-foreground">Adgangskode</h4>
            <input
              type="password"
              className="w-full border-b-2 border-black outline-none py-2 text-lg bg-transparent text-card-foreground"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ny adgangskode (valgfri)"
              autoComplete="new-password"
            />
            <div className="text-xs text-gray-400 mt-1">Udfyld kun hvis du vil ændre adgangskode</div>
          </div>
          <Button type="submit" disabled={saving} className="w-full mt-6">
            {saving ? "Gemmer..." : "Gem"}
          </Button>
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
      )}
    </div>
  );
};

export default SettingsPage;