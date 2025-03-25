// components/TrackingDetails.jsx
import { TruckIcon, CheckCircle, AlertCircle, Clock, MapPin, Package } from "lucide-react"

export default function TrackingDetails({ data }) {
  return (
    <div className="bg-white/5 rounded-xl p-6">
      {/* Nagłówek */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white/10 p-3 rounded-full">
          <Package className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{data["Informacje główne"]["Numer śledzenia"]}</h2>
          <p className="text-white/70">{data["Informacje główne"]["Kraj"]}</p>
        </div>
      </div>

      {/* Główne informacje */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sekcja statusu */}
        <div className="bg-white/10 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Status przesyłki</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(data["Informacje główne"]["Ostatni status"])}
            <span className="text-white">{data["Informacje główne"]["Ostatni status"]}</span>
          </div>
          {data["Informacje główne"]["Data"] && (
            <p className="mt-4 text-white/70">
              Ostatnia aktualizacja: {new Date(data["Informacje główne"]["Data"]).toLocaleString("pl-PL")}
            </p>
          )}
        </div>

        {/* Historia zdarzeń */}
        <div className="bg-white/10 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">Historia zdarzeń</h3>
          <div className="space-y-6">
            {data["Szczegóły przesyłki"].map((event, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-white/70">{event.Data}</div>
                <div className="flex-1">
                  <p className="text-white font-medium">{event.Status}</p>
                  <p className="text-white/60">{event.Lokalizacja}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatusIcon(status) {
  const lowerStatus = status.toLowerCase()
  
  if (lowerStatus.includes('dostarczon')) {
    return <CheckCircle className="h-6 w-6 text-green-400" />
  }
  if (lowerStatus.includes('w drodze')) {
    return <TruckIcon className="h-6 w-6 text-blue-400" />
  }
  if (lowerStatus.includes('problem')) {
    return <AlertCircle className="h-6 w-6 text-red-400" />
  }
  return <Clock className="h-6 w-6 text-yellow-400" />
}