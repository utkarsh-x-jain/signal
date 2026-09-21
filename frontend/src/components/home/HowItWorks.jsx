import ScrollReveal from "../ui/ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Collect signals",
    description:
      "Bring together maintenance records, complaints, inspections and historical infrastructure data.",
  },
  {
    number: "02",
    title: "Detect patterns",
    description:
      "Machine learning identifies unusual combinations and patterns associated with elevated infrastructure risk.",
  },
  {
    number: "03",
    title: "Prioritize action",
    description:
      "Convert complex signals into clear risk scores so teams know what needs inspection first.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-white/5 px-6 py-32"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.2em] text-white/35">
            How it works
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Turn scattered infrastructure signals into clear priorities.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
            Signal combines complaints, maintenance records, historical
            failures and emerging patterns to identify infrastructure that
            needs attention before a critical failure occurs.
          </p>
        </ScrollReveal>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <ScrollReveal key={step.number}>
              <article className="h-full rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition duration-500 hover:border-white/20 hover:bg-white/[0.035]">
                <span className="text-sm text-white/30">{step.number}</span>

                <h3 className="mt-8 text-xl font-medium text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  {step.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;