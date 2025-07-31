


"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import CreateDealForm from "@/components/CreateDealForm";
import EditDealForm from "@/components/EditDealForm";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deals, setDeals] = useState<any[]>([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    fetch("/api/business/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.salonId) setSalonId(data.salonId);
        else {
          setError("Salon ID not found");
          setShowLoginDialog(true);
        }
      })
      .catch(() => {
        setError("Failed to fetch salon info");
        setShowLoginDialog(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!salonId) return;
    setDealsLoading(true);
    fetch(`/api/business/deal/list?salonId=${salonId}`)
      .then((res) => res.json())
      .then((data) => setDeals(Array.isArray(data) ? data : []))
      .catch(() => setDeals([]))
      .finally(() => setDealsLoading(false));
  }, [salonId]);

  return (
    <>
      <Dialog open={showLoginDialog} onOpenChange={(open) => {
        if (!open) {
          window.location.href = "/";
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pleace login to access the dashboard</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => {
              setShowLoginDialog(false);
              window.location.href = "/";
            }}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              <Button onClick={() => setShowEdit(true)}>Rediger Deals</Button>
            </div>

            {/* Edit Deals Modal */}
            {showEdit && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                onClick={() => setShowEdit(false)}
              >
                <div
                  className="bg-white rounded-lg p-6 max-w-xl w-full relative"
                  onClick={e => e.stopPropagation()}
                >
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setShowEdit(false)}>&times;</button>
                  <h2 className="text-xl font-bold mb-4">Rediger Deals</h2>
                  {dealsLoading ? (
                    <div>Loading deals...</div>
                  ) : deals.length === 0 ? (
                    <div className="text-gray-400">No deals found.</div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {deals.map((deal) => (
                        <EditDealForm key={deal.id} deal={deal} onUpdated={() => setShowEdit(false)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {dealsLoading ? (
              <div className="ml-10 mt-10">Loading deals...</div>
            ) : deals.length === 0 ? (
              <div className="ml-10 mt-10 text-gray-400">No deals found.</div>
            ) : (
              deals.map((deal) => {
                const now = new Date();
                const start = new Date(deal.startDate);
                const end = new Date(deal.expiryDate);
                const isLive = now >= start && now <= end;
                return (
                  <div key={deal.id} className="flex justify-between max-w-[80%] ml-10 mt-10 items-center border-b pb-2">
                    <div className="w-16 h-16 bg-gray-200 rounded object-cover flex items-center justify-center text-xs text-gray-400">img</div>
                    <div className="flex-1 ml-4">
                      <h3 className="font-semibold">{deal.title}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant={isLive ? "default" : "secondary"} className="mx-2" disabled>
                      {isLive ? "Live" : "Offline"}
                    </Button>
                    <div className="font-bold text-lg">{deal.price} kr</div>
                  </div>
                );
              })
            )}

            <div></div>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <div>Kalender</div>
            <div>ledige tider</div>
            <div>Indtjening</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;