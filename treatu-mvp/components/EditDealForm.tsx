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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(deal.imageUrl || "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageUrl, setImageUrl] = useState<string>(deal.imageUrl || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    setImageUrl("");
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(imageUrl || "");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return imageUrl;
    setImageUploading(true);
    setImageError("");
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch("/api/business/deal/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload fejlede");
      setImageUrl(data.imageUrl);
      return data.imageUrl;
    } catch (err: any) {
      setImageError(err.message);
      return imageUrl;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    let uploadedImageUrl = imageUrl;
    if (imageFile && !imageUrl) {
      uploadedImageUrl = await handleImageUpload();
      if (!uploadedImageUrl) {
        setLoading(false);
        setError("Billedet kunne ikke uploades");
        return;
      }
    }
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
          expiryDate: form.expiryDate,
          imageUrl: uploadedImageUrl || undefined
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
          {/* Image upload section */}
          <div>
            <label className="block mb-1 font-medium">Billede</label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mb-2" />
            )}
            <input
              type="file"
              name="dealImage"
              accept="image/*"
              className="block mb-2"
              onChange={handleImageChange}
            />
            {imageUploading && <div className="text-gray-500 text-xs">Uploader billede...</div>}
            {imageError && <div className="text-red-500 text-xs">{imageError}</div>}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading || imageUploading}>{loading ? "Gemmer..." : "Gem ændringer"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
