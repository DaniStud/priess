
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
      setImagePreview("");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
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
      return "";
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
          salonId,
          imageUrl: uploadedImageUrl || undefined
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
        setImageFile(null);
        setImagePreview("");
        setImageUrl("");
        setOpen(false);
        setShowSuccessPopup(true);
      }
    } catch (err) {
      setError("Serverfejl");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                disabled={salonId == null}
              />
              {imageUploading && <div className="text-gray-500 text-xs">Uploader billede...</div>}
              {imageError && <div className="text-red-500 text-xs">{imageError}</div>}
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button type="submit" disabled={loading || salonId == null || imageUploading}>{loading ? "Opretter..." : "Opret tilbud"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      {showSuccessPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "32px 24px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "320px",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="#8B5CF6" />
                <path d="M16 24l6 6 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 500, color: "#333", marginBottom: 8, textAlign: "center" }}>
              Din deal er tilføjet til appen
            </div>
            <button
              style={{
                marginTop: 16,
                background: "#8B5CF6",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 20px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              onClick={() => setShowSuccessPopup(false)}
            >
              Luk
            </button>
          </div>
        </div>
      )}
    </>
  );
}
