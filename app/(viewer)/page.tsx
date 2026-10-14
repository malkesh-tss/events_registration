import Header from '@/components/viewer/Header'
import Hero from '@/components/viewer/Hero'
// import ChoosePath from '@/components/viewer/ChoosePath'
import Roundtables from '@/components/viewer/Roundtables'
import Workshops from '@/components/viewer/Workshops'
// import FacilitatorBio from '@/components/viewer/FacilitatorBio'
import FinalCTA from '@/components/viewer/FinalCTA'
import Footer from '@/components/viewer/Footer'
import RegistrationProvider from '@/components/viewer/RegistrationProvider'
import {
  getEvents,
  getRoundtables,
  getFeaturedWorkshop,
  getWorkshops,
} from '@/lib/api/events'

export default function LandingPage() {
  const events = getEvents()
  const roundtables = getRoundtables()
  const featured = getFeaturedWorkshop()
  const allWorkshops = getWorkshops()

  // Soonest event by scheduled date drives the "next up" CTA. Kept date-only
  // (no wall-clock) so the landing page stays fully static/prerenderable.
  const nextEvent =
    featured ??
    [...events].sort(
      (a, b) =>
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )[0]

  return (
    <RegistrationProvider events={events}>
      <Header />
      <main>
        <Hero />
        {/* <ChoosePath /> */}
        <Roundtables events={roundtables} />
        <Workshops workshops={allWorkshops} />
        {/* <FacilitatorBio /> */}
        <FinalCTA nextEvent={nextEvent} />
      </main>
      <Footer />
    </RegistrationProvider>
  )
}
