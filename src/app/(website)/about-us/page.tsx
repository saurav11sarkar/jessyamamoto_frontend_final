import { ShieldCheck, Heart, Globe, Users, Star, Award } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="pt-28 pb-16">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            About JetSet Cares
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            JetSet Cares is a trusted care platform built for families traveling,
            living, working, and raising children across Asia. We help families
            connect with local childcare partners, pet care partners, and selected
            home support partners in cities where reliable help can be difficult to
            find.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-primary/5 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              To make trusted childcare accessible for every family, everywhere.
              Because no parent should have to choose between exploring the world
              and knowing their children are safe.
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-16">
          {[
            {
              icon: ShieldCheck,
              title: "Safety First",
              description:
                "Every partner goes through a review process. We focus on trust signals, verification, and community standards to keep families safe.",
            },
            {
              icon: Heart,
              title: "Childcare First",
              description:
                "JetSet is childcare first, with trust, safety, warmth, and professionalism at the center of everything we build.",
            },
            {
              icon: Globe,
              title: "Built for Asia",
              description:
                "From homes to hotels to travel settings, JetSet is designed for the way internationally mobile families actually live.",
            },
            {
              icon: Users,
              title: "Community Driven",
              description:
                "We grow city by city through trusted local ambassadors, ensuring quality and depth before expansion.",
            },
            {
              icon: Star,
              title: "Trusted Partners",
              description:
                "Our partners are warm, reliable, professional people who families feel good trusting with their children and pets.",
            },
            {
              icon: Award,
              title: "Partner Growth",
              description:
                "We invest in our partners through badges, training, and the JetSet Academy, helping them build better careers and lives.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-2xl p-6 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8 sm:text-3xl">
            Who is JetSet Cares for?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Families traveling with children",
              "Expat families living abroad",
              "Digital nomad parents",
              "Hotel stay families",
              "Families relocating to a new city",
              "LGBTQ+ families looking for affirming care",
              "Families with pets",
              "Parents who need trusted local support",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4"
              >
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">
            Company Information
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <p className="text-gray-700 font-semibold">JetSet Care, Ltd.</p>
            <p className="text-gray-600 mt-2">
              3rd Floor, 45 Albemarle Street
              <br />
              Mayfair, London, W1S 4JL
              <br />
              United Kingdom
            </p>
            <p className="text-gray-600 mt-4">
              Email: support@jetsetcares.org
              <br />
              Phone: +44 204 634 5573
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
