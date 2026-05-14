import { getPayload } from "payload";

import config from "../payload.config.js";
import type { Grid } from "../payload-types";

type GridSeed = Pick<Grid, "label" | "kicker" | "meta" | "kind" | "orderIndex" | "localCss"> & {
  elements: NonNullable<Grid["elements"]>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const sharedContact = {
  label: "Email Jackie",
  href: "mailto:find.jackie@yahoo.com",
  openInNewTab: false,
};

const linkedIn = {
  label: "LinkedIn",
  href: "https://www.linkedin.com/in/jackie-ye-77b37b70/",
  openInNewTab: true,
};

const github = {
  label: "GitHub",
  href: "https://github.com/NoUserNameUser",
  openInNewTab: true,
};

const comfortCardCss = `
[data-grid-body] {
  width: min(700px, 74%);
  margin-left: clamp(32px, 8vw, 128px);
  text-align: left;
}
[data-grid-body] [data-grid-element],
[data-grid-body] p {
  justify-items: start;
  justify-self: start;
}
[data-grid-element="text"] {
  max-width: 680px;
}
[data-grid-element="text"] h2 {
  font-size: clamp(2.2rem, 4.2vw, 4.4rem);
  line-height: 1;
}
[data-grid-element="text"] p {
  max-width: 620px;
  font-size: clamp(0.86rem, 1vw, 0.94rem);
}
[data-grid-element="button"] { margin-top: 4px; }
`;

const grids: GridSeed[] = [
  {
    label: "Jackie Ye",
    kicker: "DRE / Full-Stack Engineer / 01",
    meta: "Release-ready systems",
    kind: "hero",
    orderIndex: 0,
    localCss: `
:scope {
  --poeza-ink: #172033;
  --poeza-muted: rgba(23, 32, 51, 0.64);
  background:
    radial-gradient(circle at 78% 72%, rgba(199, 143, 72, 0.2), transparent 29%),
    radial-gradient(circle at 18% 18%, rgba(82, 141, 137, 0.18), transparent 28%),
    linear-gradient(135deg, #f9f7ef 0%, #e7efec 52%, #efe3d0 100%);
}
[data-grid-body] { width: min(760px, 78%); }
[data-grid-element="text"] { max-width: 720px; }
[data-grid-element="text"] h2 {
  font-size: clamp(2.6rem, 5.2vw, 4.6rem);
  font-weight: 800;
  line-height: 0.98;
}
[data-grid-element="text"] p {
  max-width: 620px;
  font-size: clamp(0.84rem, 1vw, 0.95rem);
}
[data-grid-element="button"],
[data-grid-element="link"] { margin-inline: 6px; }
`,
    elements: [
      { blockType: "background", color: "#f8f6ef" },
      {
        blockType: "shape",
        name: "Signal triangle",
        shape: "triangle",
        color: "linear-gradient(180deg, rgba(28, 92, 96, 0.28), rgba(28, 92, 96, 0))",
        width: "18%",
        height: "112px",
        x: "51%",
        y: "20%",
        rotation: 0,
        zIndex: 1,
      },
      {
        blockType: "shape",
        name: "Release orbit",
        shape: "circle",
        color: "rgba(214, 80, 61, 0.18)",
        width: "220px",
        height: "220px",
        x: "78%",
        y: "70%",
        zIndex: 1,
      },
      {
        blockType: "text",
        eyebrow: "Burnaby, BC",
        heading: "Release Engineer",
        body:
          "DRE-focused full-stack engineer with 6+ years owning Rogers/Cityfone systems for 100K+ monthly users. Strongest work: Dockerized automation, CI/CD strategy, observability, CMS optimization, and cloud reliability.",
      },
      { blockType: "button", ...sharedContact, variant: "primary" },
      { blockType: "link", ...linkedIn },
      { blockType: "link", ...github },
    ],
  },
  {
    label: "Rogers / Cityfone",
    kicker: "Primary developer + technical owner / 02",
    meta: "Aug 2017 - 2025",
    kind: "quote",
    orderIndex: 1,
    localCss: `
:scope {
  --poeza-ink: #f5f7f4;
  --poeza-muted: rgba(245, 247, 244, 0.7);
  background:
    radial-gradient(circle at 18% 76%, rgba(91, 211, 190, 0.23), transparent 32%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 42%),
    #0d1822;
}
${comfortCardCss}
[data-grid-element="button"] {
  border-color: rgba(245, 247, 244, 0.44);
  color: #f5f7f4;
}
`,
    elements: [
      { blockType: "background", color: "#101820" },
      {
        blockType: "shape",
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
        blockType: "text",
        eyebrow: "Business-critical ownership",
        heading: "Platform Ownership",
        body:
          "Technical owner for Cityfone at Rogers Communications, spanning CMS platforms, internal CRM, online orders, self-serve portal flows, IVR payment updates, production troubleshooting, and 99.9% uptime expectations.",
      },
      { blockType: "button", label: "Contact", href: sharedContact.href, variant: "secondary", openInNewTab: false },
    ],
  },
  {
    label: "CMS Performance",
    kicker: "ExpressionEngine / WordPress / Drupal / 03",
    meta: "30% faster",
    kind: "index",
    orderIndex: 2,
    localCss: `
:scope {
  --poeza-ink: #17212b;
  --poeza-muted: rgba(23, 33, 43, 0.62);
  background:
    radial-gradient(circle at 82% 22%, rgba(55, 111, 164, 0.22), transparent 30%),
    linear-gradient(135deg, #fffaf0 0%, #edf3f8 58%, #f6efe4 100%);
}
${comfortCardCss}
`,
    elements: [
      { blockType: "background", color: "#fffaf0" },
      {
        blockType: "shape",
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
        blockType: "text",
        eyebrow: "CMS architecture + optimization",
        heading: "CMS Speed",
        body:
          "Reworked CMS data structures around reusable elements, bridged CMS data into CRM workflows, and reduced website load time by 30% across high-traffic customer surfaces.",
      },
      { blockType: "button", label: "LinkedIn proof", href: linkedIn.href, variant: "primary", openInNewTab: true },
    ],
  },
  {
    label: "Release Ops",
    kicker: "AWS / Docker / CI-CD / 04",
    meta: "Autoscaling + rollback",
    kind: "image",
    orderIndex: 3,
    localCss: `
:scope {
  --poeza-ink: #142235;
  --poeza-muted: rgba(20, 34, 53, 0.64);
  background:
    radial-gradient(circle at 20% 74%, rgba(65, 96, 120, 0.22), transparent 28%),
    linear-gradient(150deg, #dce6ee 0%, #f8f4ea 54%, #d5e7df 100%);
}
${comfortCardCss}
[data-grid-body] {
  align-self: end;
  margin-bottom: clamp(72px, 9vw, 140px);
}
`,
    elements: [
      { blockType: "background", color: "#e8eef2" },
      {
        blockType: "shape",
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
        blockType: "text",
        eyebrow: "Infrastructure + release reliability",
        heading: "Release Discipline",
        body:
          "Moved on-prem services toward AWS with autoscaling, designed CI/CD strategy, patched Linux/Apache/Nginx servers with rollback coverage, and used Docker/Docker Compose to standardize deployment and automation workflows.",
      },
    ],
  },
  {
    label: "Observability",
    kicker: "Spring Boot microservices / 05",
    meta: "Mapping + QA",
    kind: "text",
    orderIndex: 4,
    localCss: `
:scope {
  --poeza-ink: #17231f;
  --poeza-muted: rgba(23, 35, 31, 0.62);
  background:
    radial-gradient(circle at 27% 28%, rgba(38, 113, 95, 0.18), transparent 22%),
    radial-gradient(circle at 73% 72%, rgba(197, 87, 69, 0.16), transparent 26%),
    linear-gradient(135deg, #f2f0ea 0%, #e9f3ed 100%);
}
${comfortCardCss}
[data-grid-element="shape"]:nth-of-type(2) { animation-delay: -2s; }
`,
    elements: [
      { blockType: "background", color: "#f2f0ea" },
      {
        blockType: "shape",
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
        blockType: "shape",
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
        blockType: "text",
        eyebrow: "Debugging + system health",
        heading: "Observable Services",
        body:
          "Mapped Spring Boot microservice dependencies, documented service types and ownership, handled error flows and QA, and used system-health signals to find bottlenecks before they became delivery problems.",
      },
    ],
  },
  {
    label: "CRM + Orders",
    kicker: "Internal tools / portals / IVR / 06",
    meta: "Web orders",
    kind: "index",
    orderIndex: 5,
    localCss: `
:scope {
  --poeza-ink: #251c30;
  --poeza-muted: rgba(37, 28, 48, 0.62);
  background:
    linear-gradient(120deg, rgba(104, 72, 121, 0.16), transparent 38%),
    radial-gradient(circle at 78% 44%, rgba(255, 122, 92, 0.14), transparent 28%),
    #f7f1f8;
}
${comfortCardCss}
`,
    elements: [
      { blockType: "background", color: "#f6f2f7" },
      {
        blockType: "text",
        eyebrow: "Full-stack delivery",
        heading: "Order Systems",
        body:
          "Designed and implemented CRM bridges for CMS data, web order receiving and processing, online order systems, self-serve portal workflows, multi-site branding, and IVR payment-info updates.",
      },
      {
        blockType: "button",
        label: "Email for details",
        href: sharedContact.href,
        variant: "secondary",
        openInNewTab: false,
      },
    ],
  },
  {
    label: "DevRadius",
    kicker: "Web Developer / 07",
    meta: "May 2014 - Aug 2015",
    kind: "quote",
    orderIndex: 6,
    localCss: `
:scope {
  --poeza-ink: #17251f;
  --poeza-muted: rgba(23, 37, 31, 0.62);
  background:
    radial-gradient(circle at 75% 26%, rgba(166, 64, 52, 0.18), transparent 26%),
    linear-gradient(135deg, #eff5f1 0%, #f6efe6 100%);
}
${comfortCardCss}
`,
    elements: [
      { blockType: "background", color: "#eff5f1" },
      {
        blockType: "shape",
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
        blockType: "text",
        eyebrow: "AngularJS / REST / Stripe / Drupal",
        heading: "Product Delivery",
        body:
          "Main developer for Thrinacia Origin, built RESTful API support, integrated Stripe, and delivered Drupal CMS work with clients through agile feature sprints.",
      },
    ],
  },
  {
    label: "HA Booking",
    kicker: "Personal project / 08",
    meta: "Python + Docker + AWS",
    kind: "image",
    orderIndex: 7,
    localCss: `
:scope {
  --poeza-ink: #f3f8ef;
  --poeza-muted: rgba(243, 248, 239, 0.68);
  background:
    radial-gradient(circle at 74% 18%, rgba(122, 220, 168, 0.2), transparent 26%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.06), transparent 40%),
    #0d1110;
}
${comfortCardCss}
[data-grid-element="button"] {
  background: #f3f8ef;
  color: #111313;
  border-color: #f3f8ef;
}
`,
    elements: [
      { blockType: "background", color: "#111313" },
      {
        blockType: "shape",
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
        blockType: "shape",
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
        blockType: "shape",
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
        blockType: "text",
        eyebrow: "High-concurrency automation",
        heading: "Race-free Workers",
        body:
          "Monitors and secures time-sensitive inventory using Python, Docker Compose worker instances, AWS EC2, Bash scripting, pipeline and locking mechanisms, and network-efficiency tuning.",
      },
      { blockType: "button", label: "GitHub", href: github.href, variant: "primary", openInNewTab: true },
    ],
  },
  {
    label: "DRE Stack",
    kicker: "Languages / DevOps / CMS / 09",
    meta: "Toolbox",
    kind: "text",
    orderIndex: 8,
    localCss: `
:scope {
  --poeza-ink: #1f241f;
  --poeza-muted: rgba(31, 36, 31, 0.64);
  background:
    conic-gradient(from 90deg at 50% 50%, rgba(38, 113, 95, 0.12), transparent, rgba(214, 80, 61, 0.11), transparent),
    linear-gradient(135deg, #f8f5ed 0%, #edf4ed 100%);
}
${comfortCardCss}
[data-grid-element="text"] p { max-width: 740px; }
`,
    elements: [
      { blockType: "background", color: "#f7f4ed" },
      {
        blockType: "text",
        eyebrow: "Python / Java / Docker / CI-CD",
        heading: "DRE Toolbox",
        body:
          "Languages & frameworks: Python, Java Spring Boot, PHP, JavaScript, HTML5, CSS3, MySQL, XML, JSON.\nInfrastructure & DevOps: Docker, Docker Compose, CI/CD pipelines, Linux/Shell scripting, AWS, Apache, Nginx, Git.\nCMS & integrations: ExpressionEngine, WordPress, Drupal, REST APIs, SOAP, Stripe.",
      },
    ],
  },
  {
    label: "BCIT",
    kicker: "Computer Systems Technology / 10",
    meta: "Network Security",
    kind: "quote",
    orderIndex: 9,
    localCss: `
:scope {
  --poeza-ink: #17243a;
  --poeza-muted: rgba(23, 36, 58, 0.62);
  background:
    radial-gradient(circle at 50% 34%, rgba(42, 72, 105, 0.16), transparent 25%),
    linear-gradient(135deg, #edf1f5 0%, #f8f4ec 100%);
}
${comfortCardCss}
`,
    elements: [
      { blockType: "background", color: "#edf1f5" },
      {
        blockType: "shape",
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
        blockType: "text",
        eyebrow: "Bachelor 2017 / Diploma 2013",
        heading: "Security Roots",
        body:
          "BCIT Computer Systems Technology with focus areas in firewall architecture, socket programming, security projects, web development, programming, and software engineering methodology.",
      },
      { blockType: "button", label: "Start a conversation", href: sharedContact.href, variant: "primary", openInNewTab: false },
    ],
  },
];

async function upsertGrid(payload: Awaited<ReturnType<typeof getPayload>>, grid: GridSeed) {
  const existing = await payload.find({
    collection: "grids",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      orderIndex: {
        equals: grid.orderIndex,
      },
    },
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "grids",
      id: existing.docs[0].id,
      overrideAccess: true,
      data: grid,
    });
    return;
  }

  await payload.create({
    collection: "grids",
    overrideAccess: true,
    data: grid,
  });
}

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "global-settings",
    overrideAccess: true,
    data: {
      siteName: "Jackie Ye",
      siteUrl,
      defaultSeo: {
        metaTitle: "Jackie Ye | DRE & Full-Stack Engineer",
        metaDescription:
          "DRE-focused full-stack engineer with 6+ years owning Rogers/Cityfone systems, Dockerized automation, CI/CD strategy, observability, CMS optimization, and cloud reliability.",
        canonicalURL: siteUrl,
        ogTitle: "Jackie Ye | DRE & Full-Stack Engineer",
        ogDescription:
          "Rogers/Cityfone technical owner focused on Docker, CI/CD, observability, CMS performance, and release-ready full-stack systems.",
        structuredData: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              name: "Jackie Ye",
              url: siteUrl,
              description:
                "Portfolio for Jackie Ye, a DRE-focused full-stack engineer in Burnaby, BC.",
            },
            {
              "@type": "Person",
              "@id": `${siteUrl}/#person`,
              name: "Jackie Ye",
              url: siteUrl,
              jobTitle: "DRE-focused Full-Stack Engineer",
              email: "find.jackie@yahoo.com",
              sameAs: [linkedIn.href, github.href],
              knowsAbout: [
                "Development Release Engineering",
                "Docker",
                "Docker Compose",
                "CI/CD",
                "Observability",
                "CMS optimization",
                "Java Spring Boot",
                "Python",
                "AWS",
                "Rogers Communications",
                "Cityfone",
              ],
            },
          ],
        },
      },
      socialLinks: [linkedIn, github],
    },
  });

  for (const grid of grids) {
    await upsertGrid(payload, grid);
  }

  console.log(`Updated ${grids.length} DRE-positioned grids and global SEO settings.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
