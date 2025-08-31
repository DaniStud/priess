
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
    startDay: "",
    startMonth: "",
    startYear: "",
    expiryDay: "",
    expiryMonth: "",
    expiryYear: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      startDay: "",
      startMonth: "",
      startYear: "",
      expiryDay: "",
      expiryMonth: "",
      expiryYear: "",
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
      // Combine dropdowns into date strings
      const startDate = form.startYear && form.startMonth && form.startDay
        ? `${form.startYear}-${form.startMonth.padStart(2, "0")}-${form.startDay.padStart(2, "0")}`
        : "";
      const expiryDate = form.expiryYear && form.expiryMonth && form.expiryDay
        ? `${form.expiryYear}-${form.expiryMonth.padStart(2, "0")}-${form.expiryDay.padStart(2, "0")}`
        : "";
      const res = await fetch("/api/business/deal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          originalPrice: Number(form.originalPrice),
          price: Number(form.price),
          quantity: Number(form.quantity),
          startDate,
          expiryDate,
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
        // Refresh the page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      setError("Serverfejl");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = () => {
    return (
      form.title.trim() &&
      form.startDay && form.startMonth && form.startYear &&
      form.expiryDay && form.expiryMonth && form.expiryYear
    );
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
        // Helper arrays for dropdowns
        const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
        const months = [
          { value: "01", label: "Jan." },
          { value: "02", label: "Feb." },
          { value: "03", label: "Mar." },
          { value: "04", label: "Apr." },
          { value: "05", label: "Maj" },
          { value: "06", label: "Jun." },
          { value: "07", label: "Jul." },
          { value: "08", label: "Aug." },
          { value: "09", label: "Sep." },
          { value: "10", label: "Okt." },
          { value: "11", label: "Nov." },
          { value: "12", label: "Dec." },
        ];
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, i) => String(currentYear + i));

  const dropdownStyle = "bg-gray-100 rounded-md px-4 py-2 font-bold text-base mr-2 focus:outline-none min-w-[90px]";

        return (
          <div className="space-y-4">
            <Input 
              name="title" 
              placeholder="Overskrift" 
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
            <div className="flex flex-col gap-2">
              <label className="font-medium mb-1">Fra</label>
              <div className="flex flex-row gap-2">
                <Select value={form.startDay} onValueChange={value => handleChange({target: {name: 'startDay', value}} as any)} disabled={salonId == null}>
                  <SelectTrigger className={dropdownStyle}><SelectValue placeholder="Dag" /></SelectTrigger>
                  <SelectContent className="max-h-[180px] overflow-y-auto">
                    {days.map(day => (
                      <SelectItem key={day} value={day}>{day}.</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.startMonth} onValueChange={value => handleChange({target: {name: 'startMonth', value}} as any)} disabled={salonId == null}>
                  <SelectTrigger className={dropdownStyle}><SelectValue placeholder="Måned" /></SelectTrigger>
                  <SelectContent className="max-h-[180px] overflow-y-auto">
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.startYear} onValueChange={value => handleChange({target: {name: 'startYear', value}} as any)} disabled={salonId == null}>
                  <SelectTrigger className={dropdownStyle}><SelectValue placeholder="År" /></SelectTrigger>
                  <SelectContent className="max-h-[180px] overflow-y-auto">
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium mb-1">Til</label>
              <div className="flex flex-row gap-2">
                <Select value={form.expiryDay} onValueChange={value => handleChange({target: {name: 'expiryDay', value}} as any)} disabled={salonId == null}>
                  <SelectTrigger className={dropdownStyle}><SelectValue placeholder="Dag" /></SelectTrigger>
                  <SelectContent className="max-h-[180px] overflow-y-auto">
                    {days.map(day => (
                      <SelectItem key={day} value={day}>{day}.</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.expiryMonth} onValueChange={value => handleChange({target: {name: 'expiryMonth', value}} as any)} disabled={salonId == null}>
                  <SelectTrigger className={dropdownStyle}><SelectValue placeholder="Måned" /></SelectTrigger>
                  <SelectContent className="max-h-[180px] overflow-y-auto">
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.expiryYear} onValueChange={value => handleChange({target: {name: 'expiryYear', value}} as any)} disabled={salonId == null}>
                  <SelectTrigger className={dropdownStyle}><SelectValue placeholder="År" /></SelectTrigger>
                  <SelectContent className="max-h-[180px] overflow-y-auto">
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="m-auto space-y-4">
            <div className="mb-10">
              <label className="block mb-2 mt-10 font-medium">Tilføj billede til din deal</label>
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
            <div className="">
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
          <DialogTitle className="mb-10 md:text-4xl m-auto">Tilføj en ny deal</DialogTitle>

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
            className="bg-white border border-gray-300 rounded-3xl p-8 shadow-lg flex flex-col items-center min-w-[300px] min-h-[400px] lg:min-w-[240px] lg:min-h-[600px] pt-[150px]"
          >
            <div className="text-center text-[1.4rem] font-semibold text-[#333] mb-6 lg:text-[3.5rem] lg:font-extrabold font-league-spartan">
              Din deal er tilføjet til appen
            </div>
            <div className="mb-8 lg:mb-16">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="w-16 h-16 lg:w-40 lg:h-40">
                <defs>
                  <linearGradient id="deal-success-gradient" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d2bcff" />
                    <stop offset="100%" stopColor="#827692" />
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="24" fill="url(#deal-success-gradient)" />
                <path d="M16 24l6 6 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
