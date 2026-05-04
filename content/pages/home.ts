import { siteConfig } from "@/content/site";
import type {
  ContactContent,
  ExperienceItem,
  HeroContent,
  SEOContent,
  ServicePillar,
  ValueItem,
} from "@/types/content";

export const homeSeo: SEOContent = {
  title: "Interactive Full Stack Developer",
  description:
    "Jackie Ye builds polished full-stack products, interactive interfaces, and automation systems from idea to launch.",
};

export const homeHero: HeroContent = {
  eyebrow: "Full Stack Developer / Product Playground",
  titleLines: ["Jackie"],
  highlightedTitleLine: "Ye",
  descriptionPrefix: "I turn fuzzy ideas into products with ",
  descriptionStrong: "clear systems, sharp interfaces,",
  descriptionSuffix: " and enough play to make people want to explore.",
  primaryAction: { label: "Open the playground", href: "#build" },
  secondaryAction: { label: "Start a project", href: "#contact" },
  metrics: [
    { value: "5", suffix: "+", label: "Years shipping" },
    { value: "20", suffix: "+", label: "Products built" },
    { value: "0", suffix: "->1", label: "Favorite stage" },
  ],
};

export const marqueeItems = [
  "Interactive UI",
  "Product strategy",
  "Next.js",
  "TypeScript",
  "Java",
  "Node.js",
  "Python",
  "APIs",
  "Automation",
  "Databases",
  "Design systems",
  "Motion details",
  "Deployment",
  "Performance",
  "Idea to launch",
];

export const aboutContent = {
  sectionNumber: "01",
  title: "About",
  photoLabel: "Builder, listener, systems thinker",
  badge: `${siteConfig.name} / Full Stack Dev`,
  headlinePrefix: "The best products feel ",
  headlineHighlight: "obvious after they exist",
  headlineSuffix: " - that is the kind of work I like.",
  paragraphs: [
    "I am Jackie, a full stack developer based in the Asia-Pacific region. I work best with people who have a real idea, a messy workflow, or a product that needs to feel more alive.",
    "My job is to listen carefully, reduce the noise, and build the most direct path from first concept to something people can actually use. Strategy, backend, interface, deployment - I like owning the whole arc.",
  ],
  values: [
    { icon: "01", title: "Listen before building", description: "Turn scattered ideas into a clear product target." },
    { icon: "02", title: "Prototype in motion", description: "Make the first version tangible enough to react to." },
    { icon: "03", title: "Ship the whole thing", description: "Architecture, data, UI, deployment, and polish." },
    { icon: "04", title: "Keep it playful", description: "Tiny interactions make serious tools easier to love." },
  ] satisfies ValueItem[],
};

export const serviceContent = {
  sectionNumber: "02",
  title: "Build Modes",
  pillars: [
    {
      number: "01",
      title: "Playable Interfaces",
      body: "Interactive frontends, dashboards, landing experiences, and product surfaces that respond to the person using them.",
      tags: ["React", "Next.js", "Motion", "Canvas"],
    },
    {
      number: "02",
      title: "Full-Stack Products",
      body: "From data model to deployed app: authentication, APIs, databases, admin flows, payments, and the details that keep a product stable.",
      tags: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
    },
    {
      number: "03",
      title: "Systems & Automation",
      body: "Internal tools, integrations, scripts, and workflow systems that remove repetitive work and make operations easier to see.",
      tags: ["Python", "FastAPI", "Queues", "Cloud"],
    },
  ] satisfies ServicePillar[],
};

export const experienceContent = {
  sectionNumber: "03",
  title: "Process",
  items: [
    {
      year: "01 / DISCOVER",
      company: "Make the map",
      type: "Clarity sprint",
      role: "Define the real user, the core loop, and the smallest version worth shipping.",
      bullets: [
        "Translate rough ideas into flows, data shapes, and decisions that can be built.",
        "Spot the risks early so the first version does not become a maze.",
      ],
      chips: ["Product thinking", "UX flows", "Technical plan"],
      delay: 0,
    },
    {
      year: "02 / BUILD",
      company: "Create the engine",
      type: "Full-stack execution",
      role: "Design the system, wire the backend, and make the interface feel responsive.",
      bullets: [
        "Build APIs, databases, UI states, and integration points as one coherent product.",
        "Use motion and feedback where it helps people understand what changed.",
      ],
      chips: ["API", "Database", "Frontend", "Deployment"],
      delay: 0.1,
    },
    {
      year: "03 / LAUNCH",
      company: "Tighten the loop",
      type: "Polish and iteration",
      role: "Measure what matters, reduce friction, and leave the system easier to evolve.",
      bullets: [
        "Improve performance, accessibility, and maintainability before the handoff.",
        "Turn feedback into the next set of practical upgrades.",
      ],
      chips: ["Performance", "Accessibility", "Iteration"],
      delay: 0.2,
    },
  ] satisfies ExperienceItem[],
};

export const contactContent: ContactContent = {
  eyebrow: "Next build starts here",
  titleLines: ["LET'S", "PLAY."],
  descriptionPrefix: "Bring the half-formed idea, the workflow that annoys you, or the product you want to make memorable. ",
  descriptionStrong: "I will help turn it into something real.",
  descriptionSuffix: "",
  email: siteConfig.email,
};
