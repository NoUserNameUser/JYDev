// Options must stay in sync with the `inquiries` collection in payload.config.js.
export const SERVICE_TYPES = [
  { label: "Software Development", value: "software" },
  { label: "AI Integration", value: "ai" },
  { label: "Infrastructure & Cloud", value: "infra" },
  { label: "Website / Web App", value: "web" },
  { label: "Other / Not sure yet", value: "other" },
] as const;

export const BUDGETS = [
  { label: "Under $2k", value: "under-2k" },
  { label: "$2k – $10k", value: "2k-10k" },
  { label: "$10k – $50k", value: "10k-50k" },
  { label: "$50k+", value: "50k-plus" },
  { label: "Not sure yet", value: "undecided" },
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number]["value"];
export type Budget = (typeof BUDGETS)[number]["value"];

export type InquiryInput = {
  name: string;
  email: string;
  company?: string;
  serviceType: ServiceType;
  budget?: Budget;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

export function parseInquiry(body: unknown): { data: InquiryInput } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid request body." };
  const input = body as Record<string, unknown>;

  const name = cleanText(input.name, 120);
  if (!name) return { error: "Please provide your name." };

  const email = cleanText(input.email, 254);
  if (!email || !EMAIL_PATTERN.test(email)) return { error: "Please provide a valid email address." };

  const serviceType = SERVICE_TYPES.find((option) => option.value === input.serviceType)?.value;
  if (!serviceType) return { error: "Please select the service you are interested in." };

  const message = cleanText(input.message, 4000);
  if (!message || message.length < 10) {
    return { error: "Please describe your project in at least a few words." };
  }

  const company = cleanText(input.company, 160) ?? undefined;
  const budget = BUDGETS.find((option) => option.value === input.budget)?.value;

  return { data: { name, email, company, serviceType, budget, message } };
}
