// app/qc/loading.js
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
        <p className="text-white/70">Ładowanie...</p>
      </div>
    </div>
  )
}