"use client";

import { Users, ShieldCheck, Star, Headphones } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Families served",
  },
  {
    icon: ShieldCheck,
    value: "5,000+",
    label: "Vetted partners",
  },
  {
    icon: Star,
    value: "4.9 / 5",
    label: "Average rating",
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "Customer support",
  },
];

const TrustStats = () => {
  return (
    <section className="border-y border-border bg-muted/50 py-10">
      <div className="container px-4 sm:px-6">
        <p className="mb-8 text-center text-sm font-semibold tracking-wide text-muted-foreground">
          Trusted by families. Loved by partners.
        </p>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
              <stat.icon className="h-6 w-6 text-primary" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStats;
