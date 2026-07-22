import { BUDGETS, SERVICE_TYPES } from "@/lib/inquiries";
import type { InquiryInput } from "@/lib/inquiries";

const TELEGRAM_MESSAGE_LIMIT = 4096;
const TELEGRAM_TIMEOUT_MS = 8000;

function optionLabel<T extends readonly { label: string; value: string }[]>(
  options: T,
  value: string | undefined,
) {
  return options.find((option) => option.value === value)?.label ?? value ?? "Not provided";
}

function buildInquiryMessage(inquiry: InquiryInput) {
  const message = [
    "🆕 New website inquiry",
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company: ${inquiry.company ?? "Not provided"}`,
    `Service: ${optionLabel(SERVICE_TYPES, inquiry.serviceType)}`,
    `Budget: ${optionLabel(BUDGETS, inquiry.budget)}`,
    "",
    "Project details:",
    inquiry.message,
  ].join("\n");

  if (message.length <= TELEGRAM_MESSAGE_LIMIT) return message;
  return `${message.slice(0, TELEGRAM_MESSAGE_LIMIT - 24)}\n\n[Message truncated]`;
}

export async function notifyTelegramInquiry(inquiry: InquiryInput) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram notification is not configured.");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildInquiryMessage(inquiry),
      disable_web_page_preview: true,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Telegram API returned HTTP ${response.status}.`);
  }

  const result = (await response.json()) as { ok?: boolean };
  if (!result.ok) throw new Error("Telegram API rejected the notification.");
}
