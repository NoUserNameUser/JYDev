import type { GlobalSetting } from "@/payload-types";

import { InquiryForm } from "../inquiries/InquiryForm";
import { SiteFooter, SiteHeader } from "./SiteChrome";

const SERVICES = [
  {
    title: "Software Development",
    tag: "Build",
    description:
      "Custom backend services, REST APIs, integrations, and automation that hold up in production — not just in the demo.",
    points: ["Backend services & APIs", "Third-party integrations", "Workflow automation & scripting"],
  },
  {
    title: "AI Integration",
    tag: "Augment",
    description:
      "Practical AI features for your product or internal workflow: assistants, document processing, and retrieval over your own data.",
    points: ["LLM-powered features & chat assistants", "RAG over your documents and data", "AI workflow & agent automation"],
  },
  {
    title: "Infrastructure & Cloud",
    tag: "Run",
    description:
      "From on-premise to cloud, or from fragile to observable. I have moved a live national-brand telecom site onto AWS without downtime.",
    points: ["AWS migrations & architecture", "Docker, CI/CD pipelines", "Performance & observability"],
  },
  {
    title: "Websites & Web Apps",
    tag: "Ship",
    description:
      "Marketing sites, CMS-driven platforms, and self-serve customer portals — designed to be maintained by your team, not just launched.",
    points: ["CMS builds (Payload, headless)", "Multi-brand site architecture", "Self-serve account & support tools"],
  },
];

const PROCESS_STEPS = [
  {
    title: "Tell me about your project",
    description:
      "Fill in the inquiry form below — a rough idea is enough. It takes a few minutes and nothing is shared with anyone else.",
  },
  {
    title: "Free consultation",
    description:
      "I review your goals and constraints, then follow up by email or a short call with honest technical advice. No sales pitch, no obligation.",
  },
  {
    title: "Free estimate",
    description:
      "If you want to move forward, you get a written scope, timeline, and cost estimate — free, and yours to keep even if you build elsewhere.",
  },
  {
    title: "Build & deliver",
    description:
      "Regular progress updates, production-ready delivery, and support after launch. You own the code and the infrastructure.",
  },
];

const ABOUT_FACTS = [
  { label: "Experience", value: "9+ years in production web & telecom systems" },
  { label: "Previously", value: "Rogers Communications — web platforms for national brands" },
  { label: "Education", value: "B.Tech, Computer Systems (Network Security), BCIT" },
  { label: "Based in", value: "Vancouver, Canada — remote-friendly worldwide" },
  { label: "Languages", value: "English · 中文" },
];

export function LandingPage({ settings }: { settings: GlobalSetting | null }) {
  const siteName = settings?.siteName || "Jackie Ye";

  return (
    <div className="relative">
      <SiteHeader siteName={siteName} />

      <main id="top">
        <section className="container flex min-h-[calc(100svh-4rem)] flex-col justify-center py-section">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Jackie Ye · Freelance software consultant
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Software, AI, and infrastructure —<br className="hidden sm:block" />
            <span className="text-primary"> scoped honestly, built to last.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-strong">
            I take on freelance projects in software development, AI integration, cloud infrastructure, and the web.
            Every engagement starts with a <strong className="font-semibold text-foreground">free consultation and a free estimate</strong> —
            tell me what you are trying to build, and I will tell you what it takes.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#inquiry"
              className="rounded-pill bg-primary px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-primary-hover"
            >
              Start a free consultation
            </a>
            <a
              href="#services"
              className="rounded-pill border border-border-strong px-6 py-3 text-base font-medium text-muted-strong transition-colors hover:border-primary hover:text-foreground"
            >
              See what I do
            </a>
          </div>
          <ul className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8">
            {[
              ["9+ yrs", "production experience"],
              ["Free", "consultation & estimate"],
              ["Remote", "Vancouver · worldwide"],
            ].map(([value, label]) => (
              <li key={label}>
                <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="services" className="border-t border-border bg-surface">
          <div className="container py-section">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Services</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Four ways I can help
            </h2>
            <div className="mt-section-gap grid gap-6 md:grid-cols-2">
              {SERVICES.map((service) => (
                <article
                  key={service.title}
                  className="group rounded-md border border-border bg-surface-raised p-8 transition-colors hover:border-primary/60"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold">{service.title}</h3>
                    <span className="rounded-pill border border-border px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted group-hover:border-primary/60 group-hover:text-primary">
                      {service.tag}
                    </span>
                  </div>
                  <p className="mt-4 leading-relaxed text-muted-strong">{service.description}</p>
                  <ul className="mt-6 space-y-2">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-muted">
                        <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="border-t border-border">
          <div className="container py-section">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">How it works</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Consultation and estimates are always free
            </h2>
            <p className="mt-4 max-w-2xl text-muted-strong">
              You should not have to pay to find out whether a project is feasible, or what it should cost.
            </p>
            <ol className="mt-section-gap grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} className="relative border-t-2 border-border pt-6 transition-colors hover:border-primary">
                  <span className="font-mono text-xs text-primary">0{index + 1}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about" className="border-t border-border bg-surface">
          <div className="container grid gap-12 py-section lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">About</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                An engineer who has owned systems in production, not just shipped them
              </h2>
              <div className="mt-8 space-y-5 leading-relaxed text-muted-strong">
                <p>
                  I spent eight years at Rogers Communications building and running the web platform behind national
                  telecom brands: rebuilding a static site into a CMS-driven, multi-brand architecture where five brands
                  shared one codebase, and shipping a self-serve portal that let customers handle payments, number
                  transfers, and account changes on their own.
                </p>
                <p>
                  Along the way I migrated that platform from on-premise servers to AWS behind a load balancer, fixed
                  the deep performance problems that came with early CMS decisions, and kept it all running in
                  production. That is the experience I bring to freelance work: I care about what happens after launch.
                </p>
                <p>
                  Today I work with modern stacks — TypeScript and Next.js, Python, Payload CMS, Docker, and AI tooling
                  built on LLM APIs — while the fundamentals stay the same: understand the problem first, estimate
                  honestly, and build things the next person can maintain.
                </p>
              </div>
            </div>
            <dl className="h-fit space-y-6 rounded-md border border-border bg-surface-raised p-8 lg:mt-24">
              {ABOUT_FACTS.map((fact) => (
                <div key={fact.label} className="border-b border-border pb-5 last:border-b-0 last:pb-0">
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted">{fact.label}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="inquiry" className="border-t border-border">
          <div className="container grid gap-12 py-section lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Project inquiry</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Tell me about your project
              </h2>
              <p className="mt-6 leading-relaxed text-muted-strong">
                Whether it is a rough idea or a detailed spec, this is the fastest way to reach me. I read every
                inquiry personally and reply within one to two business days with next steps — usually a few questions,
                then a free consultation call and a written estimate.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-muted">
                {[
                  "Free consultation — email or a short call, your choice",
                  "Free written estimate with scope and timeline",
                  "No obligation, and your details are never shared",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <InquiryForm />
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} />
    </div>
  );
}
