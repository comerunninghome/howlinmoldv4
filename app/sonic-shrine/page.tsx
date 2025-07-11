import { ProtectedRoute } from "@/components/protected-route"
import SonicShrineClientPage from "./client-page"

function SonicShrinePage() {
  return <SonicShrineClientPage />
}

export default function Page() {
  return (
    <ProtectedRoute>
      <SonicShrinePage />
    </ProtectedRoute>
  )
}
