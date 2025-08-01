
"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateDealForm({ salonId }: { salonId: number | null }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    originalPrice: "",
    price: "",
    quantity: "",
    startDate: "",
    expiryDate: "",
    durationMinutes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (salonId == null) {
      setError("Salon ID is missing. Cannot create deal.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/business/deal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          originalPrice: Number(form.originalPrice),
          price: Number(form.price),
          quantity: Number(form.quantity),
          durationMinutes: Number(form.durationMinutes),
          salonId
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Kunne ikke oprette tilbud");
      } else {
        setSuccess("Tilbud oprettet!");
        setForm({
          title: "",
          description: "",
          originalPrice: "",
          price: "",
          quantity: "",
          startDate: "",
          expiryDate: "",
          durationMinutes: ""
        });
        setOpen(false);
      }
    } catch (err) {
      setError("Serverfejl");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={salonId == null}>Opret tilbud</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Opret et nyt tilbud</DialogTitle>
        <DialogDescription>Udfyld felterne herunder for at oprette et nyt tilbud.</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="title" placeholder="Titel" value={form.title} onChange={handleChange} required disabled={salonId == null} />
          <Input name="description" placeholder="Beskrivelse" value={form.description} onChange={handleChange} required disabled={salonId == null} />
          <Input name="originalPrice" placeholder="Normalpris" type="number" value={form.originalPrice} onChange={handleChange} required disabled={salonId == null} />
          <Input name="price" placeholder="Tilbudspris" type="number" value={form.price} onChange={handleChange} required disabled={salonId == null} />
          <Input name="quantity" placeholder="Antal" type="number" value={form.quantity} onChange={handleChange} required disabled={salonId == null} />
          <Input name="startDate" placeholder="Startdato" type="datetime-local" value={form.startDate} onChange={handleChange} required disabled={salonId == null} />
          <Input name="expiryDate" placeholder="Slutdato" type="datetime-local" value={form.expiryDate} onChange={handleChange} required disabled={salonId == null} />
          <Input name="durationMinutes" placeholder="Varighed (minutter)" type="number" value={form.durationMinutes} onChange={handleChange} required disabled={salonId == null} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading || salonId == null}>{loading ? "Opretter..." : "Opret tilbud"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
