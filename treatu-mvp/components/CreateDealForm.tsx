
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
        setError(data.error || "Failed to create deal");
      } else {
        setSuccess("Deal created successfully!");
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
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" disabled={salonId == null}>Create Deal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create a New Deal</DialogTitle>
        <DialogDescription>Fill in the details below to create a new deal.</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required disabled={salonId == null} />
          <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} required disabled={salonId == null} />
          <Input name="originalPrice" placeholder="Original Price" type="number" value={form.originalPrice} onChange={handleChange} required disabled={salonId == null} />
          <Input name="price" placeholder="Deal Price" type="number" value={form.price} onChange={handleChange} required disabled={salonId == null} />
          <Input name="quantity" placeholder="Quantity" type="number" value={form.quantity} onChange={handleChange} required disabled={salonId == null} />
          <Input name="startDate" placeholder="Start Date" type="datetime-local" value={form.startDate} onChange={handleChange} required disabled={salonId == null} />
          <Input name="expiryDate" placeholder="Expiry Date" type="datetime-local" value={form.expiryDate} onChange={handleChange} required disabled={salonId == null} />
          <Input name="durationMinutes" placeholder="Duration (minutes)" type="number" value={form.durationMinutes} onChange={handleChange} required disabled={salonId == null} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading || salonId == null}>{loading ? "Creating..." : "Create Deal"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
