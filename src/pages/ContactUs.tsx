// @ts-nocheck
import React, { useState } from "react"

const faqs = [
  {
    q: "How do I get started with my business account?",
    a: "Sign up, complete your business profile in Settings, then choose a subscription plan that fits your team size. You'll be up and running in minutes.",
  },
  {
    q: "Can I upgrade or downgrade my plan anytime?",
    a: "Absolutely. You can switch plans at any time from the Subscription page. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Is my business data secure?",
    a: "Yes. All data is encrypted in transit and at rest. We follow industry-standard security practices and never share your data with third parties.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept M-Pesa payments. More payment options are coming soon — contact us if you have a specific requirement.",
  },
  {
    q: "How do I add employees to my account?",
    a: "Head to the Employees section from your admin dashboard. You can invite staff by phone number and assign them roles like Shop Attendant, Store Man, or Delivery Guy.",
  },
  {
    q: "What happens when my trial expires?",
    a: "Once your 5-day free trial ends, you'll be prompted to choose a paid plan. Your data is preserved — nothing is deleted.",
  },
]

const socials = [
  {
    name: "Facebook",
    handle: "@YourBusiness",
    url: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
    color: "from-blue-600 to-blue-500",
    bg: "bg-blue-500/10 border-blue-500/25 hover:bg-blue-500/20",
    text: "text-blue-400",
  },
  {
    name: "Twitter / X",
    handle: "@YourBusiness",
    url: "https://twitter.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "from-slate-400 to-slate-300",
    bg: "bg-slate-400/10 border-slate-400/25 hover:bg-slate-400/20",
    text: "text-slate-300",
  },
  {
    name: "Instagram",
    handle: "@YourBusiness",
    url: "https://instagram.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-5 h-5"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    color: "from-pink-500 to-orange-400",
    bg: "bg-pink-500/10 border-pink-500/25 hover:bg-pink-500/20",
    text: "text-pink-400",
  },
  {
    name: "WhatsApp",
    handle: "+254 700 000 000",
    url: "https://wa.me/254700000000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.5l5.788-1.517A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.373l-.36-.213-3.437.901.916-3.348-.234-.375A9.818 9.818 0 1112 21.818z" />
      </svg>
    ),
    color: "from-green-500 to-emerald-400",
    bg: "bg-green-500/10 border-green-500/25 hover:bg-green-500/20",
    text: "text-green-400",
  },
]

// Accordion item
const FaqItem = ({ faq, index }: { faq: (typeof faqs)[0]; index: number }) => {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden
        ${
          open
            ? "border-amber-400/40 bg-amber-400/5"
            : "border-white/8 bg-white/3 hover:border-white/15"
        }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
      >
        <span className="text-sm font-semibold text-white/90 leading-snug">
          {faq.q}
        </span>
        <span
          className={`text-amber-400 text-lg font-light shrink-0 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-white/55 leading-relaxed border-t border-white/[0.06]">
          <div className="pt-3">{faq.a}</div>
        </div>
      )}
    </div>
  )
}

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    // Replace with your actual email API call
    await new Promise((r) => setTimeout(r, 1500))
    setSending(false)
    setSent(true)
  }

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none border border-white/10 focus:border-amber-400/50 transition-colors duration-200"
  const inputStyle = { background: "rgba(255,255,255,0.05)" }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(145deg, #0a0a0f 0%, #111018 50%, #0d0c15 100%)",
        fontFamily: "'Sora', 'DM Sans', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');`}</style>

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #f59e0b, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #6366f1, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 pb-24">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            We're here to help
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
            style={{
              background: "linear-gradient(135deg, #fff 30%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Get in Touch
          </h1>
          <p className="text-white/45 text-base max-w-md mx-auto leading-relaxed">
            Have a question, need support, or just want to say hi? We'd love to
            hear from you.
          </p>
        </div>

        {/* ── Quick contact cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* Email */}
          <a
            href="mailto:hello@yourbusiness.com"
            className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-white/40 mb-0.5">Email us</div>
              <div className="text-sm font-semibold text-white">
                hello@yourbusiness.com
              </div>
            </div>
          </a>

          {/* Phone */}
          <a
            href="tel:+254700000000"
            className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-emerald-400/30 hover:bg-emerald-400/5 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-400/15 border border-emerald-400/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-white/40 mb-0.5">Call us</div>
              <div className="text-sm font-semibold text-white">
                +254 700 000 000
              </div>
            </div>
          </a>

          {/* Hours */}
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/3">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/15 border border-indigo-400/25 flex items-center justify-center text-indigo-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-white/40 mb-0.5">Business hours</div>
              <div className="text-sm font-semibold text-white">
                Mon–Fri, 8am–6pm EAT
              </div>
            </div>
          </div>
        </div>

        {/* ── Main grid: Form + Socials ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          {/* Email form — wider */}
          <div className="md:col-span-3 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">
              Send us a message
            </h2>
            <p className="text-xs text-white/40 mb-6">
              We'll get back to you within 24 hours.
            </p>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-3xl">
                  ✅
                </div>
                <div className="text-lg font-bold text-white">
                  Message sent!
                </div>
                <div className="text-sm text-white/50 text-center max-w-xs">
                  Thanks for reaching out. We'll be in touch shortly.
                </div>
                <button
                  onClick={() => {
                    setSent(false)
                    setForm({ name: "", email: "", subject: "", message: "" })
                  }}
                  className="mt-2 text-xs text-amber-400 underline underline-offset-2"
                >
                  Send another
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputClass}
                    style={inputStyle}
                  />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={inputClass}
                  style={{
                    ...inputStyle,
                    color: form.subject ? "#fff" : "rgba(255,255,255,0.25)",
                  }}
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={5}
                  className={inputClass}
                  style={{ ...inputStyle, resize: "none" }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={
                    sending || !form.name || !form.email || !form.message
                  }
                  className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #d97706, #f59e0b)",
                    boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
                    color: "#0a0a0f",
                  }}
                >
                  {sending ? "Sending…" : "Send Message →"}
                </button>
              </div>
            )}
          </div>

          {/* Socials panel — narrower */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex-1">
              <h2 className="text-lg font-bold text-white mb-1">
                Find us online
              </h2>
              <p className="text-xs text-white/40 mb-5">
                Follow us for updates, tips & support.
              </p>
              <div className="flex flex-col gap-3">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${s.bg}`}
                  >
                    <span className={s.text}>{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-white/40 truncate">
                        {s.handle}
                      </div>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4 text-white/20"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Location hint */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-400/15 border border-rose-400/25 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">
                    Our Location
                  </div>
                  <div className="text-xs text-white/45 leading-relaxed">
                    Nairobi, Kenya
                    <br />
                    Available remotely across East Africa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-8">
            <div className="text-xs font-bold tracking-widest text-amber-400/80 uppercase mb-2">
              FAQ
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-white/40 mt-2">
              Can't find what you're looking for? Just send us a message above.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
