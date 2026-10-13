const faqs = [
  {
    q: 'Are Roundtables really free?',
    a: 'Yes — 100% free. The weekly Roundtable is a candid, peer-driven space to diagnose where your client acquisition and messaging are stuck. There is no cost and no pitch to attend; workshops are the paid, deep-dive option if you want to go further.',
  },
  {
    q: 'Do I need to prepare anything for the Interactive Workshops?',
    a: 'Just bring a real, current challenge — an offer, a deal stuck on price, your homepage messaging, or a discovery call you want to improve. Workshops are hands-on working sessions, so you will apply the framework to your own situation live. No slides to read beforehand.',
  },
  {
    q: 'Will recordings be available?',
    a: 'Workshop attendees receive the recording and the framework workbook so you can keep applying it after the session. Roundtables stay live and unrecorded to keep the discussion open, candid, and peer-driven.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
      <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-xl border border-border-soft bg-white p-5 shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
              {faq.q}
              <span className="ml-4 text-brand-600 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-slate-body">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
