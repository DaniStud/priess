


"use client";
import { Button } from "@/components/ui/button";
import CreateDealForm from "@/components/CreateDealForm";
import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/business/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.salonId) setSalonId(data.salonId);
        else setError("Salon ID not found");
      })
      .catch(() => setError("Failed to fetch salon info"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card p-8 rounded-lg bg-white shadow">
      <div className="ml-10 flex justify-between max-w-[80%]">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </div>
      <h1 className="mt-20 mb-10 text-3xl font-bold mb-4">Dashboard!</h1>

      <div className="grid grid-cols-2 gap-4 min-h-64">
        <div className="bg-gray-100 p-4 rounded">
          <div className="flex justify-between max-w-[80%] ml-10">
            {loading ? (
              <Button disabled>Loading...</Button>
            ) : error ? (
              <span className="text-red-500 text-sm">{error}</span>
            ) : (
              <CreateDealForm salonId={salonId} />
            )}
            <Button>Rediger Deals</Button>
          </div>

          <div className="flex justify-between max-w-[80%] ml-10 mt-10">
            <div>+</div>
            <h3>Tilføj nyt tilbud</h3>
            <Button>start</Button>
          </div>

          <div></div>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <div>Kalender</div>
          <div>ledige tider</div>
          <div>Indtjening</div>
        </div>
      </div>
    </div>
  );
}