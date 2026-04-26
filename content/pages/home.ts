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
  title: "Full Stack Developer",
  description:
    "Full stack developer based in Asia-Pacific. I listen, plan precisely, and build the most direct path to your vision.",
};

export const homeHero: HeroContent = {
  eyebrow: "Full Stack Developer - Asia-Pacific",
  titleLines: ["JACKIE"],
  highlightedTitleLine: "YE",
  descriptionPrefix: "I'm Jackie - I don't just write code. ",
  descriptionStrong: "I listen, understand,",
  descriptionSuffix: " then build the most direct path to what you truly envision.",
  primaryAction: { label: "Start a Conversation", href: "#contact" },
  secondaryAction: { label: "See what I build", href: "#build" },
  metrics: [
    { value: "7", suffix: "+", label: "Years shipping" },
    { value: "20", suffix: "+", label: "Products built" },
    { value: "∞", label: "Ideas welcomed" },
  ],
};

export const marqueeItems = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "AWS",
  "GraphQL",
  "Figma",
  "Git",
  "Tailwind",
  "Prisma",
];

export const aboutContent = {
  sectionNumber: "01",
  title: "About Me",
  photoLabel: "Your photo here",
  badge: `${siteConfig.name} - Full Stack Dev`,
  headlinePrefix: "I believe every encounter is ",
  headlineHighlight: "meaningful",
  headlineSuffix: " - including this one.",
  paragraphs: [
    "I'm Jackie, a full stack developer based in Asia-Pacific. I don't just write code - I listen to understand what you're truly trying to achieve, then build the most direct, elegant path to get you there.",
    "My approach is simple: understand deeply, plan precisely, execute efficiently. Whether it's a startup idea, a business tool, or a creative platform - if you can imagine it, I can build it.",
  ],
  values: [
    { icon: "◆", title: "Understand First", description: "Listen, then build" },
    { icon: "◆", title: "Ship Fast, Ship Right", description: "Speed with craft" },
    { icon: "◆", title: "End-to-End Ownership", description: "Design -> Deploy" },
    { icon: "◆", title: "Long-term Thinking", description: "Built to scale" },
  ] satisfies ValueItem[],
};

export const serviceContent = {
  sectionNumber: "02",
  title: "What I Build",
  pillars: [
    {
      number: "01",
      title: "Products & Apps",
      body: "Full-stack web and mobile applications - from idea to deployed product. I handle architecture, database, API, and UI with equal care.",
      tags: ["React", "Next.js", "Node.js", "PostgreSQL"],
    },
    {
      number: "02",
      title: "APIs & Systems",
      body: "Scalable backends, microservices, and integrations that power products at scale. Performance and reliability are non-negotiable.",
      tags: ["Python", "FastAPI", "GraphQL", "Docker"],
    },
    {
      number: "03",
      title: "Interfaces & Craft",
      body: "Interfaces that feel alive. I bridge design and engineering to create digital experiences that your users will love and remember.",
      tags: ["TypeScript", "Tailwind", "Framer", "Figma"],
    },
  ] satisfies ServicePillar[],
};

export const experienceContent = {
  sectionNumber: "03",
  title: "Experience",
  items: [
    {
      year: "2023 - Present",
      company: "TechCorp",
      type: "Full-time - Remote",
      role: "Senior Full Stack Developer",
      current: true,
      bullets: [
        "Led architecture of core SaaS platform - 40% faster, 50k+ monthly users",
        "Built real-time collaboration engine using WebSockets and operational transforms",
        "Drove microservices migration, reducing deployment complexity by 60%",
        "Mentored 4 junior developers; established testing and review culture",
      ],
      chips: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
      delay: 0,
    },
    {
      year: "2022 - 2023",
      company: "StartupXYZ",
      type: "Full-time - Hybrid",
      role: "Full Stack Developer",
      bullets: [
        "Built React Native app from zero to 10k monthly active users in 6 months",
        "Implemented multi-tenant API handling 2M+ daily requests",
        "Integrated Stripe, Twilio, and Mapbox into production workflows",
      ],
      chips: ["React Native", "Node.js", "MongoDB", "Docker"],
      delay: 0.1,
    },
    {
      year: "2021 - 2022",
      company: "AgencyABC",
      type: "Internship - On-site",
      role: "Frontend Developer Intern",
      bullets: [
        "Delivered 8 client projects with React and Vue - pixel-perfect to spec",
        "Lifted Lighthouse scores from 58 to 96 across all properties",
      ],
      chips: ["React", "Vue", "CSS"],
      delay: 0.2,
    },
  ] satisfies ExperienceItem[],
};

export const contactContent: ContactContent = {
  eyebrow: "Our paths have crossed",
  titleLines: ["LET'S", "BUILD."],
  descriptionPrefix: "Tell me your vision. Whether it's a bold idea or a half-formed thought - ",
  descriptionStrong: "I want to hear it.",
  descriptionSuffix: " Every great product started as a conversation.",
  email: siteConfig.email,
};
