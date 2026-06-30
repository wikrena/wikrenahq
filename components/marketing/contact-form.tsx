"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

const INTERESTS = [
  { value: "academy", label: "Joining the Academy" },
  { value: "consulting", label: "Data or AI consulting engagement" },
  { value: "corporate", label: "Corporate training for my team" },
  { value: "partnership", label: "Partnership or collaboration" },
  { value: "other", label: "Something else" },
];

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again or email us directly.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-teal-500" />
        </div>
        <h3 className="font-display font-black text-2xl text-navy-800 tracking-tight mb-2">
          Message received.
        </h3>
        <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
          We will get back to you within 24 hours. If your matter is urgent, email us directly at{" "}
          <a href="mailto:hello@wikrena.com" className="text-teal-600 font-semibold hover:text-teal-500 transition-colors">
            hello@wikrena.com
          </a>
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-navy-800 placeholder:text-neutral-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-navy-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full name <span className="text-coral-500">*</span></label>
          <input
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email address <span className="text-coral-500">*</span></label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Company or organisation <span className="text-neutral-400 font-normal">(optional)</span></label>
        <input
          type="text"
          placeholder="Where do you work or what are you building?"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>What brings you here? <span className="text-coral-500">*</span></label>
        <select
          required
          value={form.interest}
          onChange={(e) => update("interest", e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="" disabled>Select the best match</option>
          {INTERESTS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Message <span className="text-coral-500">*</span></label>
        <textarea
          required
          rows={5}
          placeholder="Tell us what you are looking to achieve. The more context, the better we can help."
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-red-600 text-sm">{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-shine group w-full inline-flex items-center justify-center gap-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-navy-900 font-bold text-sm py-3.5 rounded-xl transition-all duration-300 ease-brand hover:-translate-y-0.5"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
        {status !== "sending" && (
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-brand" />
        )}
      </button>

      <p className="text-neutral-400 text-xs text-center">
        We respond to every message within 24 hours, usually sooner.
      </p>
    </form>
  );
}
