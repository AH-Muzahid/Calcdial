"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Report Fee Schedule Change / Outdated Rate");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) {
      newErrors.name = "Please enter your name.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate reliable submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 600);
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 text-center space-y-3 animate-in fade-in duration-200">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-emerald-950">
          Message Received!
        </h3>
        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
          Thank you for reaching out to the CalcDial team. We have received your inquiry and typically respond within 24–48 business hours.
        </p>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="mt-3 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer min-h-11"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
      {/* Name Input */}
      <div>
        <label htmlFor="contact-name" className="block text-xs font-semibold text-zinc-700 cursor-pointer">
          Your Name <span className="text-rose-600">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="e.g. Alex Morgan"
          className={`mt-1 h-11 min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 transition-colors ${
            errors.name
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
              : "border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
          }`}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.name}</span>
          </p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="contact-email" className="block text-xs font-semibold text-zinc-700 cursor-pointer">
          Email Address <span className="text-rose-600">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder="you@example.com"
          className={`mt-1 h-11 min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 transition-colors ${
            errors.email
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
              : "border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
          }`}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      {/* Subject Dropdown */}
      <div>
        <label htmlFor="contact-subject" className="block text-xs font-semibold text-zinc-700 cursor-pointer">
          Subject
        </label>
        <select
          id="contact-subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 h-11 min-h-11 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 transition-colors"
        >
          <option>Report Fee Schedule Change / Outdated Rate</option>
          <option>Suggest a New Calculator / Feature</option>
          <option>Partnership or Advertising Inquiry</option>
          <option>General Question</option>
        </select>
      </div>

      {/* Message Textarea */}
      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-zinc-700 cursor-pointer">
          Message <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Tell us what you need or provide a link to the updated fee schedule..."
          className={`mt-1 w-full rounded-xl border bg-white p-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 transition-colors ${
            errors.message
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
              : "border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
          }`}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.message}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-11 rounded-xl bg-zinc-950 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-zinc-800 active:scale-[0.99] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <span>Sending...</span>
        ) : (
          <>
            <Send className="size-4" />
            <span>Send Message</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-zinc-500 text-center">
        We generally respond within 24–48 business hours.
      </p>
    </form>
  );
}
