import { Navigation } from "@/components/navigation"

export default function Loading() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20 px-4 py-8 flex items-center justify-center ">
        <p className="text-xl text-teal-400 sacred-text animate-pulse">Attuning Sonic Shrine...</p>
      </div>
    </>
  )
}
