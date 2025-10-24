"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#171010" }}>
      {/* Hero Section */}
      <section
        className="px-6 py-20 md:py-28"
        style={{ backgroundColor: "#171010" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              WE DON'T
              <br />
              FOLLOW TRENDS
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We set them. Since 2015, we've been crafting premium leather and
              metal for those who refuse to blend in.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-6 py-20" style={{ backgroundColor: "#2B2B2B" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                THE ORIGIN STORY
              </h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  Started in a garage with a sewing machine, a dream, and way
                  too much black leather. What began as custom patches for local
                  bands turned into something bigger.
                </p>
                <p>
                  We saw a gap in the market. Mass-produced garbage trying to
                  look edgy, or overpriced designer pieces that missed the point
                  entirely. Real rebels needed real gear.
                </p>
                <p>
                  So we built it ourselves. Every stitch, every stud, every
                  piece of hardware chosen with purpose. No compromises. No
                  shortcuts.
                </p>
              </div>
            </div>
            <div
              className="aspect-square flex items-center justify-center text-9xl border"
              style={{ backgroundColor: "#171010", borderColor: "#362222" }}
            >
              🏍️
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-20" style={{ backgroundColor: "#171010" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            WHAT WE STAND FOR
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="p-8 border transition-all"
              style={{ borderColor: "#362222", backgroundColor: "#2B2B2B" }}
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">
                QUALITY OVER EVERYTHING
              </h3>
              <p className="text-gray-300">
                Premium materials, expert craftsmanship, built to last. Your
                gear should outlive trends.
              </p>
            </div>
            <div
              className="p-8 border transition-all"
              style={{ borderColor: "#362222", backgroundColor: "#2B2B2B" }}
            >
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-white mb-3">
                AUTHENTICITY
              </h3>
              <p className="text-gray-300">
                No posers, no pretenders. We live this lifestyle. Every piece is
                designed by people who actually wear this stuff.
              </p>
            </div>
            <div
              className="p-8 border transition-all"
              style={{ borderColor: "#362222", backgroundColor: "#2B2B2B" }}
            >
              <div className="text-4xl mb-4">🤘</div>
              <h3 className="text-xl font-bold text-white mb-3">
                INDIVIDUALITY
              </h3>
              <p className="text-gray-300">
                Express yourself. Custom work is our specialty. Your vision, our
                execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="px-6 py-20" style={{ backgroundColor: "#2B2B2B" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="aspect-square flex items-center justify-center text-9xl border order-2 lg:order-1"
              style={{ backgroundColor: "#171010", borderColor: "#362222" }}
            >
              ✂️
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                THE CRAFT
              </h2>
              <div className="space-y-4 text-gray-300 text-lg">
                <p>
                  Every jacket is hand-cut from full-grain leather. Every stud
                  is hand-set. Every zipper is tested to withstand years of
                  abuse.
                </p>
                <p>
                  We source our materials from the same suppliers that high-end
                  fashion houses use, but we skip the markup and the bullshit.
                </p>
                <p>
                  Our workshop isn't a factory. It's a collective of
                  craftspeople who give a damn about what they make. You'll feel
                  the difference the moment you put it on.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="px-6 py-20" style={{ backgroundColor: "#171010" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            MORE THAN A BRAND
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            We're a community of riders, musicians, artists, and rebels who
            refuse to compromise. When you rock our gear, you're part of
            something bigger.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "PIECES CRAFTED", value: "50K+" },
              { label: "COUNTRIES", value: "40+" },
              { label: "CUSTOM ORDERS", value: "15K+" },
              { label: "YEARS STRONG", value: "10+" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-6 border"
                style={{ borderColor: "#362222", backgroundColor: "#2B2B2B" }}
              >
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20" style={{ backgroundColor: "#362222" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            READY TO JOIN?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Browse our collections or hit us up for custom work. Let's create
            something legendary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="px-8 py-4 text-white font-bold text-sm tracking-wider transition-all transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: "#171010" }}
            >
              SHOP NOW
            </a>
            <a
              href="/contact"
              className="px-8 py-4 text-white font-medium text-sm tracking-wider border transition-colors cursor-pointer"
              style={{ borderColor: "#423F3E", backgroundColor: "transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#2B2B2B")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              CUSTOM ORDERS
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
