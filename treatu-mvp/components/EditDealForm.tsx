"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditDealForm({ deal, onUpdated }: { deal: any, onUpdated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: deal.title || "",
    description: deal.description || "",
    originalPrice: deal.originalPrice?.toString() || "",
    price: deal.price?.toString() || "",
    quantity: deal.quantity?.toString() || "",
    startDate: deal.startDate ? new Date(deal.startDate).toISOString().slice(0,16) : "",
    expiryDate: deal.expiryDate ? new Date(deal.expiryDate).toISOString().slice(0,16) : "",
    durationMinutes: deal.durationMinutes?.toString() || ""
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
    try {
      const res = await fetch(`/api/business/deal/${deal.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          originalPrice: Number(form.originalPrice),
          price: Number(form.price),
          quantity: Number(form.quantity),
          durationMinutes: Number(form.durationMinutes),
          startDate: form.startDate,
          expiryDate: form.expiryDate
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update deal");
      } else {
        setSuccess("Deal updated successfully!");
        setOpen(false);
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
        <div>{deal.title}</div>
        <div className="flex justify-between gap-2 mt-2">
          <Button variant="secondary">Rediger</Button>
          <Button
            className="dark"
            variant="destructive"
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              if (!confirm(`Er du sikker på, at du vil slette '${deal.title}'?`)) return;
              try {
                const res = await fetch(`/api/business/deal/${deal.id}/delete`, { method: "DELETE" });
                if (!res.ok) {
                  alert("Kunne ikke slette tilbuddet");
                } else {
                  if (onUpdated) onUpdated();
                }
              } catch {
                alert("Serverfejl");
              }
            }}
          >
            Slet
          </Button>
        </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Rediger tilbud</DialogTitle>
        <DialogDescription>Opdater felterne herunder og gem ændringer.</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="title" placeholder="Titel" value={form.title} onChange={handleChange} required />
          <Input name="description" placeholder="Beskrivelse" value={form.description} onChange={handleChange} required />
          <Input name="originalPrice" placeholder="Normalpris" type="number" value={form.originalPrice} onChange={handleChange} required />
          <Input name="price" placeholder="Tilbudspris" type="number" value={form.price} onChange={handleChange} required />
          <Input name="quantity" placeholder="Antal" type="number" value={form.quantity} onChange={handleChange} required />
          <Input name="startDate" placeholder="Startdato" type="datetime-local" value={form.startDate} onChange={handleChange} required />
          <Input name="expiryDate" placeholder="Slutdato" type="datetime-local" value={form.expiryDate} onChange={handleChange} required />
          <Input name="durationMinutes" placeholder="Varighed (minutter)" type="number" value={form.durationMinutes} onChange={handleChange} required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Gemmer..." : "Gem ændringer"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
