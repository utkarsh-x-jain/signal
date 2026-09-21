import ScrollReveal from "../ui/ScrollReveal";
import Button from "../ui/Button";

function CTA() {
  return (
    <section id="dashboard" className="border-t border-white/5 px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] px-8 py-16 text-center sm:px-16">
            <p className="text-sm uppercase tracking-[0.2em] text-white/30">
              The next layer
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
              From warning signals to confident decisions.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
              Explore the intelligence dashboard and understand why an asset
              is considered high risk.
            </p>

            <Button className="mt-10">Explore dashboard</Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default CTA;