import Header from '@/components/viewer/Header'
import Hero from '@/components/viewer/Hero'
// import ChoosePath from '@/components/viewer/ChoosePath'
import Roundtables from '@/components/viewer/Roundtables'
import Workshops from '@/components/viewer/Workshops'
// import FacilitatorBio from '@/components/viewer/FacilitatorBio'
import FinalCTA from '@/components/viewer/FinalCTA'
import Footer from '@/components/viewer/Footer'
import RegistrationProvider from '@/components/viewer/RegistrationProvider'

export default function LandingPage() {
  // All events are sourced live from Eventbrite: the schedule tables and the
  // "Reserve your spot" modal fetch them client-side (cached in Neon). The
  // landing page itself stays fully static/prerenderable, so no seed catalog.
  return (
    <RegistrationProvider events={[]}>
      <Header />
      <main>
        <Hero />
        {/* <ChoosePath /> */}
        <Roundtables events={[]} />
        <Workshops workshops={[]} />
        {/* <FacilitatorBio /> */}
        <FinalCTA />
      </main>
      <Footer />
    </RegistrationProvider>
  )
}
