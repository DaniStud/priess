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
        <Button variant="secondary">Edit:</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Deal</DialogTitle>
        <DialogDescription>Update the details below and save changes.</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <Input name="originalPrice" placeholder="Original Price" type="number" value={form.originalPrice} onChange={handleChange} required />
          <Input name="price" placeholder="Deal Price" type="number" value={form.price} onChange={handleChange} required />
          <Input name="quantity" placeholder="Quantity" type="number" value={form.quantity} onChange={handleChange} required />
          <Input name="startDate" placeholder="Start Date" type="datetime-local" value={form.startDate} onChange={handleChange} required />
          <Input name="expiryDate" placeholder="Expiry Date" type="datetime-local" value={form.expiryDate} onChange={handleChange} required />
          <Input name="durationMinutes" placeholder="Duration (minutes)" type="number" value={form.durationMinutes} onChange={handleChange} required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
