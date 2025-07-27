export default function DashboardHome() {
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
            <button>Opret ny Deal</button>
            <button>Overblik</button>
            <button>Rediger Live Deals</button>

          </div>

          <div className="flex justify-between max-w-[80%] ml-10 mt-10">
            <div>+</div>
            <h3>Tilføj nyt tilbud</h3>
            <button>start</button>
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