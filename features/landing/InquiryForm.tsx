"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { BUDGETS, SERVICE_TYPES } from "@/lib/inquiries";

type SubmitState = { status: "idle" | "submitting" | "success" } | { status: "error"; message: string };

const inputClasses =
  "w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:shadow-focus";

function Field({ label, htmlFor, optional, children }: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-sm font-medium">
        {label}
        {optional ? <span className="font-mono text-xs text-muted">optional</span> : null}
      </label>
      {children}
    </div>
  );
}

export function InquiryForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          serviceType: formData.get("serviceType"),
          budget: formData.get("budget"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Something went wrong. Please try again.");
      }

      form.reset();
      setState({ status: "success" });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="flex h-full flex-col items-start justify-center rounded-md border border-primary/40 bg-primary-soft p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Inquiry received</p>
        <h3 className="mt-4 font-display text-2xl font-semibold">Thanks — I&apos;ll be in touch soon.</h3>
        <p className="mt-4 leading-relaxed text-muted-strong">
          Your inquiry has been saved and I usually reply within one to two business days. Keep an eye on your inbox
          (and the spam folder, just in case).
        </p>
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="mt-8 rounded-pill border border-border-strong px-5 py-2 text-sm font-medium text-muted-strong transition-colors hover:border-primary hover:text-foreground"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-md border border-border bg-surface-raised p-8" noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" htmlFor="inquiry-name">
          <input id="inquiry-name" name="name" type="text" required maxLength={120} autoComplete="name" placeholder="Jane Doe" className={inputClasses} />
        </Field>
        <Field label="Email" htmlFor="inquiry-email">
          <input id="inquiry-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="jane@company.com" className={inputClasses} />
        </Field>
      </div>

      <Field label="Company" htmlFor="inquiry-company" optional>
        <input id="inquiry-company" name="company" type="text" maxLength={160} autoComplete="organization" placeholder="Acme Inc." className={inputClasses} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="What do you need?" htmlFor="inquiry-service">
          <select id="inquiry-service" name="serviceType" required defaultValue="" className={inputClasses}>
            <option value="" disabled>
              Select a service…
            </option>
            {SERVICE_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget range" htmlFor="inquiry-budget" optional>
          <select id="inquiry-budget" name="budget" defaultValue="" className={inputClasses}>
            <option value="">Select a range…</option>
            {BUDGETS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Project details" htmlFor="inquiry-message">
        <textarea
          id="inquiry-message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          placeholder="What are you trying to build or fix? Rough goals, timeline, and any existing systems are all helpful."
          className={inputClasses}
        />
      </Field>

      {/* Honeypot: hidden from real users; bots that fill it are silently dropped. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="inquiry-website">Website</label>
        <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" ? (
        <p role="alert" className="rounded-md border border-secondary/50 bg-secondary/10 px-4 py-3 text-sm text-secondary">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state.status === "submitting"}
        className="w-full rounded-pill bg-primary px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.status === "submitting" ? "Sending…" : "Request free consultation & estimate"}
      </button>
      <p className="text-center text-xs text-muted">
        Your details are only used to respond to this inquiry — no mailing lists, no sharing.
      </p>
    </form>
  );
}
