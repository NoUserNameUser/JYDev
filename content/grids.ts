import type { GridElement, GridKind, GridSection } from "@/types/grid";

type ResumeGrid = {
  id: string;
  label: string;
  kicker: string;
  meta: string;
  kind: GridKind;
  elements: GridElement[];
  localCss: string;
  orderIndex: number;
};

const linkedinUrl = "https://www.linkedin.com/in/jackie-ye-77b37b70/";
const githubUrl = "https://github.com/";
const emailUrl = "mailto:find.jackie@yahoo.com";

const premiumGridCss = {
  jackieYe: `
:scope {
  --poeza-ink: #172033;
  --poeza-muted: rgba(23, 32, 51, 0.64);
  background:
    radial-gradient(circle at 78% 72%, rgba(199, 143, 72, 0.2), transparent 29%),
    radial-gradient(circle at 18% 18%, rgba(82, 141, 137, 0.18), transparent 28%),
    linear-gradient(135deg, #f9f7ef 0%, #e7efec 52%, #efe3d0 100%);
}
[data-grid-body] { width: min(860px, 82%); }
[data-grid-element="text"] { max-width: 780px; }
[data-grid-element="text"] h2 {
  font-size: clamp(3rem, 6.8vw, 7.4rem);
  font-weight: 800;
}
[data-grid-element="text"] p { max-width: 620px; }
[data-grid-element="button"],
[data-grid-element="link"] { margin-inline: 6px; }
`,
  technicalOwner: `
:scope {
  --poeza-ink: #f5f7f4;
  --poeza-muted: rgba(245, 247, 244, 0.7);
  background:
    radial-gradient(circle at 18% 76%, rgba(91, 211, 190, 0.23), transparent 32%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 42%),
    #0d1822;
}
[data-grid-body] {
  width: min(900px, 78%);
  margin-left: clamp(32px, 8vw, 130px);
  text-align: left;
}
[data-grid-body] [data-grid-element] { justify-items: start; }
[data-grid-element="button"] {
  border-color: rgba(245, 247, 244, 0.44);
  color: #f5f7f4;
}
`,
  cmsPerformance: `
:scope {
  --poeza-ink: #17212b;
  --poeza-muted: rgba(23, 33, 43, 0.62);
  background:
    radial-gradient(circle at 82% 22%, rgba(55, 111, 164, 0.22), transparent 30%),
    linear-gradient(135deg, #fffaf0 0%, #edf3f8 58%, #f6efe4 100%);
}
[data-grid-body] { width: min(680px, 76%); }
[data-grid-element="text"] h2 { font-size: clamp(2.4rem, 5vw, 5.4rem); }
`,
  cloudDevops: `
:scope {
  --poeza-ink: #142235;
  --poeza-muted: rgba(20, 34, 53, 0.64);
  background:
    radial-gradient(circle at 20% 74%, rgba(65, 96, 120, 0.22), transparent 28%),
    linear-gradient(150deg, #dce6ee 0%, #f8f4ea 54%, #d5e7df 100%);
}
[data-grid-body] {
  align-self: end;
  margin-bottom: clamp(72px, 9vw, 140px);
  margin-left: clamp(32px, 8vw, 130px);
  width: min(720px, 76%);
  text-align: left;
}
[data-grid-body] [data-grid-element] { justify-items: start; }
`,
  microservices: `
:scope {
  --poeza-ink: #17231f;
  --poeza-muted: rgba(23, 35, 31, 0.62);
  background:
    radial-gradient(circle at 27% 28%, rgba(38, 113, 95, 0.18), transparent 22%),
    radial-gradient(circle at 73% 72%, rgba(197, 87, 69, 0.16), transparent 26%),
    linear-gradient(135deg, #f2f0ea 0%, #e9f3ed 100%);
}
[data-grid-element="shape"]:nth-of-type(2) { animation-delay: -2s; }
`,
  commerceCrm: `
:scope {
  --poeza-ink: #251c30;
  --poeza-muted: rgba(37, 28, 48, 0.62);
  background:
    linear-gradient(120deg, rgba(104, 72, 121, 0.16), transparent 38%),
    radial-gradient(circle at 78% 44%, rgba(255, 122, 92, 0.14), transparent 28%),
    #f7f1f8;
}
[data-grid-body] {
  width: min(680px, 74%);
  margin-left: clamp(34px, 8vw, 128px);
  text-align: left;
}
[data-grid-body] [data-grid-element],
[data-grid-body] p {
  justify-items: start;
  justify-self: start;
}
`,
  devradius: `
:scope {
  --poeza-ink: #17251f;
  --poeza-muted: rgba(23, 37, 31, 0.62);
  background:
    radial-gradient(circle at 75% 26%, rgba(166, 64, 52, 0.18), transparent 26%),
    linear-gradient(135deg, #eff5f1 0%, #f6efe6 100%);
}
[data-grid-body] { width: min(840px, 80%); }
[data-grid-element="text"] h2 { font-size: clamp(2.3rem, 4.9vw, 5.7rem); }
`,
  bookingSystem: `
:scope {
  --poeza-ink: #f3f8ef;
  --poeza-muted: rgba(243, 248, 239, 0.68);
  background:
    radial-gradient(circle at 74% 18%, rgba(122, 220, 168, 0.2), transparent 26%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.06), transparent 40%),
    #0d1110;
}
[data-grid-element="button"] {
  background: #f3f8ef;
  color: #111313;
  border-color: #f3f8ef;
}
`,
  skillsStack: `
:scope {
  --poeza-ink: #1f241f;
  --poeza-muted: rgba(31, 36, 31, 0.64);
  background:
    conic-gradient(from 90deg at 50% 50%, rgba(38, 113, 95, 0.12), transparent, rgba(214, 80, 61, 0.11), transparent),
    linear-gradient(135deg, #f8f5ed 0%, #edf4ed 100%);
}
[data-grid-body] {
  width: min(780px, 80%);
  margin-left: clamp(32px, 8vw, 130px);
  text-align: left;
}
[data-grid-body] [data-grid-element],
[data-grid-body] p {
  justify-items: start;
  justify-self: start;
}
[data-grid-element="text"] p { max-width: 720px; }
`,
  education: `
:scope {
  --poeza-ink: #17243a;
  --poeza-muted: rgba(23, 36, 58, 0.62);
  background:
    radial-gradient(circle at 50% 34%, rgba(42, 72, 105, 0.16), transparent 25%),
    linear-gradient(135deg, #edf1f5 0%, #f8f4ec 100%);
}
[data-grid-element="text"] h2 { font-size: clamp(2.3rem, 5.1vw, 5.8rem); }
`,
};

const resumeGrids: ResumeGrid[] = [
  {
    id: "jackie-ye",
    label: "Jackie Ye",
    kicker: "Full Stack Developer / 01",
    meta: "Resume map",
    kind: "hero",
    orderIndex: 0,
    elements: [
      { type: "background", color: "#f8f6ef" },
      {
        type: "shape",
        name: "Signal triangle",
        shape: "triangle",
        color: "linear-gradient(180deg, rgba(28, 92, 96, 0.28), rgba(28, 92, 96, 0))",
        opacity: 1,
        width: "18%",
        height: "112px",
        x: "51%",
        y: "20%",
        rotation: 0,
        zIndex: 1,
      },
      {
        type: "shape",
        name: "Orbit",
        shape: "circle",
        color: "rgba(214, 80, 61, 0.18)",
        opacity: 1,
        width: "220px",
        height: "220px",
        x: "78%",
        y: "70%",
        zIndex: 1,
      },
      {
        type: "text",
        eyebrow: "Burnaby, BC / 778-881-0548",
        heading: "Full Stack Developer",
        body: "6+ years architecting scalable web applications, microservices, high-traffic CMS platforms, and DevOps automation.",
      },
      { type: "button", label: "Email Jackie", href: emailUrl, variant: "primary", openInNewTab: false },
      { type: "link", label: "LinkedIn", href: linkedinUrl, openInNewTab: true },
      { type: "link", label: "GitHub", href: githubUrl, openInNewTab: true },
    ],
    localCss: premiumGridCss.jackieYe,
  },
  {
    id: "technical-owner",
    label: "Cityfone",
    kicker: "Rogers Communications / 02",
    meta: "Aug 2017 - 2025",
    kind: "quote",
    orderIndex: 1,
    elements: [
      { type: "background", color: "#101820" },
      {
        type: "shape",
        name: "Availability ring",
        shape: "circle",
        color: "rgba(99, 190, 174, 0.2)",
        width: "44%",
        height: "44%",
        x: "18%",
        y: "76%",
        zIndex: 1,
      },
      {
        type: "text",
        eyebrow: "Primary Developer & Technical Owner",
        heading: "Digital systems for 100K+ monthly users.",
        body: "Owned Cityfone technical delivery across CMS platforms, internal CRM, online ordering, self-serve portal work, and production reliability.",
      },
      { type: "button", label: "Contact", href: emailUrl, variant: "secondary" },
    ],
    localCss: premiumGridCss.technicalOwner,
  },
  {
    id: "cms-performance",
    label: "CMS",
    kicker: "Load optimization / 03",
    meta: "30% faster",
    kind: "index",
    orderIndex: 2,
    elements: [
      { type: "background", color: "#fffaf0" },
      {
        type: "shape",
        name: "Reusable block",
        shape: "rectangle",
        color: "rgba(26, 92, 140, 0.14)",
        width: "58%",
        height: "18%",
        x: "68%",
        y: "28%",
        rotation: -8,
        zIndex: 1,
      },
      {
        type: "text",
        eyebrow: "ExpressionEngine / WordPress / Drupal",
        heading: "Reusable CMS architecture.",
        body: "Reworked CMS data structure around reusable elements, bridged CMS data into CRM workflows, and reduced website load time by 30%.",
      },
      { type: "button", label: "LinkedIn Proof", href: linkedinUrl, variant: "primary", openInNewTab: true },
    ],
    localCss: premiumGridCss.cmsPerformance,
  },
  {
    id: "cloud-devops",
    label: "Cloud",
    kicker: "AWS / Docker / CI-CD / 04",
    meta: "Autoscaling",
    kind: "image",
    orderIndex: 3,
    elements: [
      { type: "background", color: "#e8eef2" },
      {
        type: "shape",
        name: "Deployment path",
        shape: "triangle",
        color: "rgba(65, 96, 120, 0.2)",
        width: "22%",
        height: "160px",
        x: "22%",
        y: "72%",
        rotation: 180,
        zIndex: 1,
      },
      {
        type: "text",
        eyebrow: "Infrastructure & reliability",
        heading: "Moved services into cloud-native operations.",
        body: "Migrated on-prem services to AWS with autoscaling, designed CI/CD strategy, patched servers with rollback coverage, and maintained Linux/Apache/Nginx environments.",
      },
    ],
    localCss: premiumGridCss.cloudDevops,
  },
  {
    id: "microservices",
    label: "Services",
    kicker: "Spring Boot microservices / 05",
    meta: "Mapping + QA",
    kind: "text",
    orderIndex: 4,
    elements: [
      { type: "background", color: "#f2f0ea" },
      {
        type: "shape",
        name: "Service node",
        shape: "circle",
        color: "rgba(38, 113, 95, 0.22)",
        width: "96px",
        height: "96px",
        x: "28%",
        y: "28%",
        zIndex: 1,
      },
      {
        type: "shape",
        name: "Service node",
        shape: "circle",
        color: "rgba(214, 80, 61, 0.2)",
        width: "136px",
        height: "136px",
        x: "72%",
        y: "72%",
        zIndex: 1,
      },
      {
        type: "text",
        eyebrow: "Java Spring Boot / REST / SOAP",
        heading: "Dependencies made visible.",
        body: "Mapped microservice dependencies, organized service type and description records, and handled error flows plus QA for internal reliability.",
      },
    ],
    localCss: premiumGridCss.microservices,
  },
  {
    id: "commerce-crm",
    label: "CRM",
    kicker: "Orders / portals / IVR / 06",
    meta: "Web orders",
    kind: "index",
    orderIndex: 5,
    elements: [
      { type: "background", color: "#f6f2f7" },
      {
        type: "text",
        eyebrow: "Internal CRM + customer workflows",
        heading: "From CMS data to order processing.",
        body: "Designed and implemented CRM bridges for CMS data, web order receiving and processing, online order systems, self-serve portal flows, and payment info updates through IVR.",
      },
      { type: "button", label: "Email for details", href: emailUrl, variant: "secondary" },
    ],
    localCss: premiumGridCss.commerceCrm,
  },
  {
    id: "devradius",
    label: "DevRadius",
    kicker: "Web Developer / 07",
    meta: "May 2014 - Aug 2015",
    kind: "quote",
    orderIndex: 6,
    elements: [
      { type: "background", color: "#eff5f1" },
      {
        type: "shape",
        name: "Angular mark",
        shape: "triangle",
        color: "rgba(166, 64, 52, 0.22)",
        width: "26%",
        height: "180px",
        x: "75%",
        y: "26%",
        rotation: 28,
        zIndex: 1,
      },
      {
        type: "text",
        eyebrow: "Thrinacia Origin / AngularJS / Stripe",
        heading: "Built product features end to end.",
        body: "Main developer for the AngularJS application Thrinacia Origin, built RESTful API support, integrated Stripe, and delivered Drupal CMS work in agile client sprints.",
      },
    ],
    localCss: premiumGridCss.devradius,
  },
  {
    id: "booking-system",
    label: "HA Booking",
    kicker: "Personal project / 08",
    meta: "Python + Docker + AWS",
    kind: "image",
    orderIndex: 7,
    elements: [
      { type: "background", color: "#111313" },
      {
        type: "shape",
        name: "Worker lane",
        shape: "rectangle",
        color: "rgba(122, 220, 168, 0.18)",
        width: "72%",
        height: "9px",
        x: "50%",
        y: "30%",
        zIndex: 1,
      },
      {
        type: "shape",
        name: "Worker lane",
        shape: "rectangle",
        color: "rgba(122, 220, 168, 0.16)",
        width: "58%",
        height: "9px",
        x: "50%",
        y: "50%",
        zIndex: 1,
      },
      {
        type: "shape",
        name: "Worker lane",
        shape: "rectangle",
        color: "rgba(122, 220, 168, 0.14)",
        width: "66%",
        height: "9px",
        x: "50%",
        y: "70%",
        zIndex: 1,
      },
      {
        type: "text",
        eyebrow: "High-concurrency inventory",
        heading: "Parallel workers without race conditions.",
        body: "Monitors and secures time-sensitive inventory using Docker Compose worker instances, AWS EC2, Bash scripting, locking mechanisms, and optimized network execution.",
      },
      { type: "button", label: "GitHub", href: githubUrl, variant: "primary", openInNewTab: true },
    ],
    localCss: premiumGridCss.bookingSystem,
  },
  {
    id: "skills-stack",
    label: "Stack",
    kicker: "Languages / CMS / DevOps / 09",
    meta: "Toolbox",
    kind: "text",
    orderIndex: 8,
    elements: [
      { type: "background", color: "#f7f4ed" },
      {
        type: "text",
        eyebrow: "Python / Java / PHP / JavaScript",
        heading: "A practical full-stack toolkit.",
        body: "Languages & frameworks: Python, Java Spring Boot, PHP, JavaScript, HTML5, CSS3, MySQL, XML, JSON.\nInfrastructure: Microservices, Docker, Docker Compose, Git, Apache, Nginx, CI/CD, Linux/Shell.\nCMS & APIs: ExpressionEngine, WordPress, Drupal, REST APIs, SOAP.",
      },
      { type: "link", label: "LinkedIn", href: linkedinUrl, openInNewTab: true },
    ],
    localCss: premiumGridCss.skillsStack,
  },
  {
    id: "education",
    label: "BCIT",
    kicker: "Computer Systems Technology / 10",
    meta: "Network Security",
    kind: "quote",
    orderIndex: 9,
    elements: [
      { type: "background", color: "#edf1f5" },
      {
        type: "shape",
        name: "Security triangle",
        shape: "triangle",
        color: "rgba(42, 72, 105, 0.18)",
        width: "24%",
        height: "176px",
        x: "50%",
        y: "34%",
        rotation: 180,
        zIndex: 1,
      },
      {
        type: "text",
        eyebrow: "Bachelor 2017 / Diploma 2013",
        heading: "Security-minded engineering roots.",
        body: "BCIT Computer Systems Technology with focus areas in firewall architecture, socket programming, security projects, web development, programming, and software engineering methodology.",
      },
      { type: "button", label: "Start a conversation", href: emailUrl, variant: "primary" },
    ],
    localCss: premiumGridCss.education,
  },
];

export const defaultGridSections: GridSection[] = resumeGrids;
