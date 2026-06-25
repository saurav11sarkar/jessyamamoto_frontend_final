"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const contactCards = [
  {
    icon: Mail,
    title: "Email",
    description: "For support, account help, and privacy-related questions.",
    details: ["support@jetsetcares.org", "privacy@jetsetcares.org"],
  },
  {
    icon: Phone,
    title: "Phone",
    description: "Speak with our team for urgent booking or support needs.",
    details: ["+44 204 634 5573"],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Quick questions? Reach us directly on WhatsApp.",
    details: ["Chat with us on WhatsApp"],
    href: "https://wa.me/442046345573",
  },
  {
    icon: MapPin,
    title: "Office",
    description: "Our registered office location in the United Kingdom.",
    details: [
      "JetSet Care, Ltd.",
      "3rd Floor, 45 Albemarle Street",
      "Mayfair, London, W1S 4JL",
      "United Kingdom",
    ],
  },
];

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\n${formData.message}`,
        }),
      });

      if (res.ok) {
        toast.success(
          "Message sent successfully! We will get back to you soon.",
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_30%,#f8fafc_100%)] pb-20 pt-28">
      <div className="container px-4 sm:px-6">
        <section className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10 sm:py-14">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_68%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  Friendly support, clear answers
                </div>
                <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  Contact JetSet Cares with confidence.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Whether you need booking support, membership help, or want to
                  explore a partnership, our team is here to respond with care
                  and clarity.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-sm text-slate-500">Support</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      Fast replies
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-sm text-slate-500">Channels</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      4 ways
                    </p>
                  </div>
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm text-slate-500">Best for</p>
                    <p className="mt-2 text-2xl font-bold text-primary">
                      Families & partners
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.3)] sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                      Why Reach Out
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold">
                      Thoughtful help at every step
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {[
                    "Get assistance with bookings, memberships, and account issues",
                    "Ask about safety, policies, privacy, or provider partnerships",
                    "Choose the contact method that works best for you",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <p className="text-sm leading-6 text-slate-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[26px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {card.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {card.description}
                    </p>
                    <div className="mt-4 space-y-1.5 text-sm text-slate-700">
                      {card.details.map((detail) =>
                        card.href ? (
                          <a
                            key={detail}
                            href={card.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80"
                          >
                            {detail}
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        ) : (
                          <p key={detail}>{detail}</p>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
                Send a Message
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Tell us how we can help
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Share a few details and our team will get back to you as soon as
                possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Message *
                </label>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                  placeholder="Tell us more..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-full text-base font-semibold shadow-[0_14px_35px_hsl(var(--primary)/0.22)] sm:w-auto sm:min-w-[180px]"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
