
"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const CATEGORIES = [
  "Hårklipning",
  "Farve",
  "Highlights", 
  "Permanent",
  "Styling",
  "Behandling",
  "Negle",
  "Massage",
  "Ansigtsbehandling",
  "Øjenbryn og vipper",
  "Andet"
];

export default function CreateDealForm({ salonId }: { salonId: number | null }) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    originalPrice: "",
    price: "",
    quantity: "1",
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

  const handleCategoryChange = (value: string) => {
    setForm({ ...form, category: value });
  };

  const nextStep = () => {
    setError("");
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      category: "",
      description: "",
      originalPrice: "",
      price: "",
      quantity: "1",
      startDate: "",
      expiryDate: "",
      durationMinutes: ""
    });
    setCurrentStep(1);
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
    setError("");
    setSuccess("");
  };

  const handleDialogChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      resetForm();
    }
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

  const handleSubmit = async () => {
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
          title: form.title,
          description: form.description,
          originalPrice: Number(form.originalPrice),
          price: Number(form.price),
          quantity: Number(form.quantity),
          startDate: form.startDate,
          expiryDate: form.expiryDate,
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
        resetForm();
        setOpen(false);
        setShowSuccessPopup(true);
      }
    } catch (err) {
      setError("Serverfejl");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = () => {
    return form.title.trim() && form.startDate && form.expiryDate;
  };

  const isStep2Valid = () => {
    return form.description.trim();
  };

  const isStep3Valid = () => {
    return form.durationMinutes && Number(form.durationMinutes) > 0;
  };

  const isStep4Valid = () => {
    return form.originalPrice && form.price && Number(form.originalPrice) > 0 && Number(form.price) > 0;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Input 
              name="title" 
              placeholder="Titel" 
              value={form.title} 
              onChange={handleChange} 
              required 
              disabled={salonId == null} 
            />
            <div>
              <Select value={form.category} onValueChange={handleCategoryChange} disabled={true}>
                <SelectTrigger className="opacity-50 cursor-not-allowed border-gray-300" title="Coming soon">
                  <SelectValue placeholder="Vælg kategori - Coming soon" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input 
              name="startDate" 
              placeholder="Startdato" 
              type="datetime-local" 
              value={form.startDate} 
              onChange={handleChange} 
              required 
              disabled={salonId == null} 
            />
            <Input 
              name="expiryDate" 
              placeholder="Slutdato" 
              type="datetime-local" 
              value={form.expiryDate} 
              onChange={handleChange} 
              required 
              disabled={salonId == null} 
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Billede</label>
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
            <div>
              <label className="block mb-2 font-medium">Beskrivelse</label>
              <textarea 
                name="description" 
                placeholder="Beskrivelse af tilbuddet..." 
                value={form.description} 
                onChange={handleChange} 
                required 
                disabled={salonId == null}
                rows={4}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Varighed</label>
              <Input 
                name="durationMinutes" 
                placeholder="Varighed i minutter (f.eks. 60)" 
                type="number" 
                value={form.durationMinutes} 
                onChange={handleChange} 
                required 
                disabled={salonId == null}
                min="1"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Input 
              name="originalPrice" 
              placeholder="Normalpris (kr.)" 
              type="number" 
              value={form.originalPrice} 
              onChange={handleChange} 
              required 
              disabled={salonId == null}
              min="0"
              step="0.01"
            />
            <Input 
              name="price" 
              placeholder="Tilbudspris (kr.)" 
              type="number" 
              value={form.price} 
              onChange={handleChange} 
              required 
              disabled={salonId == null}
              min="0"
              step="0.01"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Grundlæggende oplysninger";
      case 2: return "Billede og beskrivelse";
      case 3: return "Varighed";
      case 4: return "Priser";
      default: return "Opret tilbud";
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return isStep1Valid();
      case 2: return isStep2Valid();
      case 3: return isStep3Valid();
      case 4: return isStep4Valid();
      default: return false;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button variant="default" disabled={salonId == null}>Opret tilbud</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogTitle>{getStepTitle()}</DialogTitle>
          <DialogDescription>
            {currentStep === 1 && "Udfyld grundlæggende oplysninger for dit tilbud."}
            {currentStep === 2 && "Tilføj et billede og beskrivelse af dit tilbud."}
            {currentStep === 3 && "Angiv varigheden for dit tilbud."}
            {currentStep === 4 && "Angiv priser for dit tilbud."}
          </DialogDescription>
          
          {/* Progress indicator */}
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`w-2 h-2 rounded-full ${currentStep >= step ? 'bg-primary' : 'bg-gray-300'}`} />
            ))}
          </div>

          {renderStepContent()}

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}

          <div className="flex justify-between space-x-2">
            {currentStep > 1 && (
              <Button 
                type="button" 
                onClick={prevStep}
                disabled={loading}
              >
                Forrige
              </Button>
            )}
            
            <div className="flex-1" />
            
            {currentStep < 4 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!canProceedToNextStep() || salonId == null}
              >
                Næste trin
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleSubmit}
                disabled={loading || !canProceedToNextStep() || salonId == null || imageUploading}
              >
                {loading ? "Gemmer..." : "Gem deal"}
              </Button>
            )}
          </div>
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
