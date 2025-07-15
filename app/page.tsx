import { Suspense } from "react" // Import Suspense
import CreateJoinForm from "@/components/create-join-form"
import LoadingSpinner from "@/components/loading-spinner" // Import the new loading component
import HomeFooter from "@/components/home-footer" // Import the new footer component

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateJoinForm />
      <HomeFooter /> {/* Add the footer component */}
    </Suspense>
  )
}
