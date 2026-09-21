import { motion } from "framer-motion";
import ScrollReveal from "../ui/ScrollReveal";

const problems = [
  {
    number: "01",
    title: "Signals stay fragmented",
    description:
      "Complaints, maintenance records, inspections and incidents often live in separate systems, making patterns difficult to see.",
  },
  {
    number: "02",
    title: "Risk is discovered late",
    description:
      "Teams often react after visible damage or failure instead of identifying the smaller warning signals that came before it.",
  },
  {
    number: "03",
    title: "Priorities remain unclear",
    description:
      "When hundreds of assets need attention, teams need a reliable way to decide which one should be inspected first.",
  },
];

function Problem() {
  return (
    <section
      id="problem"
      className="border-t border-white/5 px-6 py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Intro */}
          <ScrollReveal>
            <p className="text-sm uppercase tracking-[0.2em] text-white/35">
              The problem
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl">
              Infrastructure rarely fails without a signal.
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/40 sm:text-lg">
              The challenge is finding those signals early enough to turn
              scattered warnings into preventative action.
            </p>
          </ScrollReveal>

          {/* Problems */}
          <div className="space-y-4">
            {problems.map((problem, index) => (
              <ScrollReveal key={problem.number}>
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-colors duration-500 hover:border-white/20 hover:bg-white/[0.035]"
                >
                  <div className="flex gap-6">
                    <span className="pt-1 text-sm text-white/25">
                      {problem.number}
                    </span>

                    <div>
                      <h3 className="text-xl font-medium tracking-tight text-white">
                        {problem.title}
                      </h3>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                        {problem.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 h-px w-0 bg-white/20 transition-all duration-500 group-hover:w-full" />
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Problem;