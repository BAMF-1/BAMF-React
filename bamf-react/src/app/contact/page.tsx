"use client";

const ContactPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#171010" }}>
      {/* Hero Section */}
      <section
        className="px-6 py-20 md:py-28"
        style={{ backgroundColor: "#171010" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              REACH
              OUT
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We're not hiding. Hit us up through your preferred channel and
              we'll get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="px-6 py-16" style={{ backgroundColor: "#2B2B2B" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Email */}
            <div
              className="p-8 border transition-all cursor-pointer group"
              style={{ borderColor: "#362222", backgroundColor: "#171010" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#362222";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#171010";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-white mb-3">EMAIL</h3>
              <p className="text-gray-400 mb-4">
                For general inquiries, orders, and custom requests
              </p>
              <a
                href="mailto:rebel@hellsedge.co"
                className="text-white font-medium"
              >
                rebel@hellsedge.co
              </a>
            </div>

            {/* Phone */}
            <div
              className="p-8 border transition-all cursor-pointer group"
              style={{ borderColor: "#362222", backgroundColor: "#171010" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#362222";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#171010";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-white mb-3">PHONE</h3>
              <p className="text-gray-400 mb-4">
                Mon-Fri: 10AM - 7PM PST
                <br />
                We actually pick up
              </p>
              <a href="tel:+15551666420" className="text-white font-medium">
                +1 (555) 166-6420
              </a>
            </div>

            {/* Social */}
            <div
              className="p-8 border transition-all cursor-pointer group"
              style={{ borderColor: "#362222", backgroundColor: "#171010" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#362222";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#171010";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-3">SOCIALS</h3>
              <p className="text-gray-400 mb-4">
                Slide into our DMs for quick responses
              </p>
              <div className="space-y-2">
                <p className="text-white font-medium">@hellsedge</p>
                <p className="text-gray-500 text-sm">
                  Instagram • Twitter • TikTok
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="px-6 py-20" style={{ backgroundColor: "#171010" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Physical Location */}
            <div
              className="p-10 border"
              style={{ borderColor: "#362222", backgroundColor: "#2B2B2B" }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                VISIT THE DEN
              </h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <p className="text-white text-lg font-medium mb-2">
                    666 Rebel Boulevard
                  </p>
                  <p className="text-white text-lg font-medium">
                    Darkside District
                  </p>
                  <p className="text-white text-lg font-medium mb-4">
                    Los Angeles, CA 90666
                  </p>
                </div>
                <div
                  className="pt-4 border-t"
                  style={{ borderColor: "#362222" }}
                >
                  <p className="text-sm text-gray-400 mb-2">STORE HOURS</p>
                  <p className="text-white">Mon-Sat: 11AM - 8PM</p>
                  <p className="text-white">Sunday: 12PM - 6PM</p>
                </div>
                <p className="text-gray-400 text-sm pt-4">
                  Street parking available. Look for the building with the
                  massive skull mural.
                </p>
              </div>
            </div>

            {/* Response Time */}
            <div
              className="p-10 border"
              style={{ borderColor: "#362222", backgroundColor: "#2B2B2B" }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                WHAT TO EXPECT
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-white font-medium mb-2">
                    ⚡ RESPONSE TIME
                  </p>
                  <p className="text-gray-300">
                    We reply within 24 hours on business days. Usually much
                    faster.
                  </p>
                </div>
                <div>
                  <p className="text-white font-medium mb-2">
                    🛠️ CUSTOM ORDERS
                  </p>
                  <p className="text-gray-300">
                    Hit us up for custom leather work, patches, or special
                    requests. We love a challenge.
                  </p>
                </div>
                <div>
                  <p className="text-white font-medium mb-2">📦 ORDER ISSUES</p>
                  <p className="text-gray-300">
                    Something wrong with your order? Email us immediately and
                    we'll make it right.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20" style={{ backgroundColor: "#2B2B2B" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            BEFORE YOU ASK
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "Do you do custom sizing?",
                answer:
                  "Hell yeah. Send us your measurements and we'll make it fit like a second skin.",
              },
              {
                question: "What's the return policy?",
                answer:
                  "30 days, no questions asked. Custom pieces are final sale though.",
              },
              {
                question: "How long does shipping take?",
                answer:
                  "Standard orders ship in 2-3 business days. Custom work takes 3-4 weeks depending on complexity.",
              },
              {
                question: "International shipping?",
                answer: "We ship worldwide. Rebels have no borders.",
              },
              {
                question: "Can I visit the store?",
                answer:
                  "Absolutely. Come through, try stuff on, talk shop. No appointment needed.",
              },
              {
                question: "Wholesale inquiries?",
                answer:
                  "Email us at wholesale@hellsedge.co for bulk orders and retailer partnerships.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-6 border transition-all"
                style={{ borderColor: "#362222", backgroundColor: "#171010" }}
              >
                <h4 className="text-lg font-bold text-white mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;