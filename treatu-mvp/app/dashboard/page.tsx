


"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import CreateDealForm from "@/components/CreateDealForm";
import EditDealForm from "@/components/EditDealForm";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [salonId, setSalonId] = useState<number | null>(null);
  const [salonName, setSalonName] = useState<string>("");
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
        if (data.salonId) {
          setSalonId(data.salonId);
          setSalonName(data.salonName || "");
        } else {
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
          <div className="flex items-center">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 border border-gray-400 mr-3">
              {/* Empty profile pic vector */}
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" stroke="currentColor" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" />
              </svg>
            </span>
            <h3 className="text-lg font-semibold text-gray-700">
              {loading ? (
                <span className="text-gray-400">Loading...</span>
              ) : error ? (
                <span className="text-red-500">-</span>
              ) : (
                salonName ? salonName : <span className="text-gray-400">No salon</span>
              )}
            </h3>
          </div>
          <div className="group relative lg:flex hidden items-center w-full max-w-xs border border-gray-400 rounded-full px-2 py-1 bg-white overflow-hidden cursor-pointer">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8c85a3] mr-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" stroke="#2d253a" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#2d253a" strokeWidth="2" />
              </svg>
            </span>
            <span className="text-gray-500 text-lg select-none opacity-60">Søg her...</span>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-white text-base font-bold">Kommer snart</span>
            </div>
          </div>
          <button
            type="button"
            className="group relative lg:flex hidden items-center px-7 py-3 rounded-full bg-[#8c85a3] border border-gray-700 focus:outline-none"
            style={{ minWidth: '220px' }}
            tabIndex={-1}
            disabled
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full mr-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-white font-bold text-lg opacity-40">Tilføj forretning</span>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-white text-base font-bold">Kommer snart</span>
            </div>
          </button>
        </div>
        <h1 className="mt-20 mb-10 text-3xl font-bold mb-4">Dashboard</h1>

        <div className="lg:grid lg:grid-cols-2 gap-4 min-h-64">
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
          <div className="relative bg-gray-100 p-4 rounded pointer-events-none select-none overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded z-10">
              <span className="text-white text-2xl font-bold">Kommer snart</span>
            </div>
            <div className="relative z-0 filter blur-[2px] pointer-events-none select-none">
              {/* Calendar Icon */}
              <div className="flex justify-center mb-4">
                {/* Calendar visual matching the pasted image */}
                <div className="relative w-[340px] bg-white rounded-lg shadow-inner p-4 pt-6">
                  <span className="absolute right-4 top-2 text-black text-sm font-normal">Se kalender</span>
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-x-2 mb-1">
                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d, i) => (
                      <div key={d} className={`text-center text-base ${i === 0 ? 'font-bold text-[#2d253a]' : 'font-normal text-[#8c85a3]'}`}>{d}</div>
                    ))}
                  </div>
                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-x-2 gap-y-1">
                    {Array.from({length: 31 + 1}).map((_, idx) => {
                      // Days start on Su, so 1st is col 0
                      if (idx === 0) {
                        // Empty cell for alignment (Su is 1st)
                        return <div key="empty0"></div>;
                      }
                      const day = idx;
                      // Days to circle (from image): 2,3,6,10,11,12,13,16,17,18,19
                      const purpleDays = [2,10,11,12,13,16,17,18,19];
                      const blackDays = [3,6];
                      let border = "";
                      let text = "text-[#8c85a3]";
                      if (day === 1) {
                        text = "font-bold text-[#2d253a]";
                      }
                      if (purpleDays.includes(day)) {
                        border = "border-2 border-[#b9a6f6]";
                      } else if (blackDays.includes(day)) {
                        border = "border-2 border-[#2d253a]";
                      }
                      return (
                        <div key={day} className={`w-8 h-8 flex items-center justify-center rounded-full ${border} bg-transparent ${text}`}>{day}</div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Booked Times Section */}
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Bookede tider i kalender</h3>
                {/* Progress Bar */}
                <div className="w-full bg-gray-300 rounded-full h-3 mb-2">
                  <div className="bg-blue-400 h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>75% booket</span>
                  <span>15/20 tider</span>
                </div>
                <div className="text-xs text-gray-400">11.250 kr. tjent ud af 15.000 kr.</div>
              </div>
              {/* Expected Earnings Section */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Forventet indtjening</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-500">15.000 kr.</span>
                  <button className="ml-2 p-2 rounded-full bg-gray-200">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;