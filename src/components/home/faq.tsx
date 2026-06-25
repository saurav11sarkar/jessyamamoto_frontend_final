"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const faqGroups = [
  {
    category: "General Questions",
    intro:
      "Start here to understand what JetSet Cares is, who it serves, and how the platform is designed for modern families.",
    items: [
      {
        question: "What is JetSet Cares?",
        answer:
          "JetSet Cares is a trusted care platform built for families traveling, living, working, and raising children across Asia.\n\nWe help families connect with local childcare partners, pet care partners, and selected home support partners in cities where reliable help can be difficult to find. JetSet is childcare first, with trust, safety, warmth, and professionalism at the center of everything we build.\n\nJetSet's core strategy has always been to become the trusted childcare platform in Asia, not just another broad services marketplace.",
      },
      {
        question: "Who is JetSet Cares for?",
        answer:
          "JetSet Cares is for families traveling with children, expat families living abroad, digital nomad parents, hotel stay families, families relocating to a new city, LGBTQ+ families looking for affirming care, families with pets, and parents who need trusted local support in unfamiliar places.",
      },
      {
        question: "Where is JetSet Cares available?",
        answer:
          "JetSet Cares is launching city by city across Asia. Some cities may open first with childcare, while others may be marked as coming soon until enough qualified partners are approved.\n\nOur goal is not to list cities before they are ready. A city is considered truly live when families can open JetSet and feel there are trusted, professional, and responsive partners available.",
      },
      {
        question: "Is JetSet Cares a childcare agency?",
        answer:
          "No. JetSet Cares is a platform that helps families discover and connect with independent partners.\n\nPartners are not employees of JetSet Cares. Families are responsible for reviewing profiles, communicating with partners, asking questions, and deciding who they feel comfortable booking.",
      },
      {
        question:
          "Why should families use JetSet instead of finding someone in a Facebook group?",
        answer:
          "Because JetSet is designed to make the process calmer, clearer, and more professional.\n\nInstead of searching through random posts, families can view partner profiles, badges, service areas, experience, languages, photos, availability, reviews, and verification status in one place.\n\nThe goal is to reduce anxiety for parents in unfamiliar cities, which is the emotional heart of the platform.",
      },
    ],
  },
  {
    category: "Family Questions",
    intro:
      "Everything families usually ask before creating an account, sending a message, or confirming care in a new city.",
    items: [
      {
        question: "How do families sign up?",
        answer:
          "Families can create an account, choose their city, browse available partners, and message or book directly through the JetSet platform.\n\nFamily accounts should be accepted automatically after sign up unless there is a security, payment, or account concern.",
      },
      {
        question: "Do families need to be approved before using JetSet?",
        answer:
          "No. Families should be able to sign up and access the platform right away.\n\nHowever, JetSet may review or restrict accounts that appear fraudulent, unsafe, abusive, or in violation of our Terms and Conditions.",
      },
      {
        question: "Can I message a partner before booking?",
        answer:
          "Yes. Families should be able to message partners before confirming a booking.\n\nThis is important because parents may want to ask about experience, languages spoken, comfort with specific ages, hotel care, pets, special needs, LGBTQ+ affirming care, or other family needs.",
      },
      {
        question: "Can I book childcare at a hotel?",
        answer:
          "Yes. JetSet is designed for families who may need care in hotels, serviced apartments, homes, condos, or travel settings.\n\nFamilies should clearly tell the partner the care location, hotel name if applicable, number of children, children's ages, start time, end time, and any special instructions.",
      },
      {
        question: "Can I book care for a baby or toddler?",
        answer:
          "Yes, if the partner offers infant or toddler care.\n\nFamilies should carefully review the partner's profile and badges to confirm experience with the child's age group.",
      },
      {
        question: "Can I book special needs care?",
        answer:
          "Yes, if the partner lists special needs experience or a related badge.\n\nFamilies should message the partner first and explain the child's needs clearly before booking.",
      },
      {
        question: "Can LGBTQ+ families use JetSet?",
        answer:
          "Yes. JetSet Cares is built to be welcoming to LGBTQ+ families.\n\nPartners may be able to earn an LGBTQ+ Affirming badge as part of the JetSet badge system. This badge is intended to help families identify partners who understand the importance of respectful, affirming care.",
      },
      {
        question: "Can I book pet care?",
        answer:
          "Yes. Pet Care is part of the initial JetSet launch structure.\n\nPet care may include services such as pet sitting, drop ins, feeding, walking, or basic care depending on the city and partner.",
      },
      {
        question: "Can I book home repair or yard help?",
        answer:
          "Home Repair is planned as a controlled rollout category, including selected services such as plumbers, remodelers, painters, and yard workers.\n\nThis category may not be available in every launch city right away.",
      },
    ],
  },
  {
    category: "Safety and Trust",
    intro:
      "The most important questions around reviews, verification, and what families should do when something does not feel right.",
    items: [
      {
        question: "Are partners verified?",
        answer:
          "JetSet reviews partners before their profiles become live.\n\nPartners may be asked to provide identification, profile details, work experience, references, location information, and other information needed for review.",
      },
      {
        question: "Does JetSet run background checks?",
        answer:
          "Where available and legally permitted, JetSet may use identity verification, document review, reference checks, badge review, and other trust signals.\n\nBecause laws and verification tools vary by country, families should always use their own judgment, ask questions, and choose the partner they feel comfortable with.",
      },
      {
        question: "Are partners manually reviewed?",
        answer:
          "Yes. Partners should go through manual review before becoming live on the platform.\n\nJetSet's ambassador and partner standards make clear that the goal is not to collect random names, but to find warm, reliable, professional people who families would feel good trusting.",
      },
      {
        question: "What does it mean if a partner is not approved yet?",
        answer:
          "It means their account may exist, but their profile is not live for family bookings yet.\n\nPartners should still be able to log in, complete their profile, upload requested information, and check their status.",
      },
      {
        question: "What should I ask a childcare partner before booking?",
        answer:
          "Helpful questions include:\nWhat ages do you have experience caring for?\nDo you speak my child's language?\nHave you cared for children in hotels or travel settings?\nAre you comfortable with bedtime, meals, diapers, bottles, swimming supervision, or multiple children?\nDo you have first aid or CPR training?\nAre you comfortable with pets in the home?\nHave you worked with LGBTQ+ families, neurodivergent children, or children with special needs?",
      },
      {
        question: "What if I feel uncomfortable with a partner?",
        answer:
          "Do not book them.\n\nFamilies should only book someone they feel safe and comfortable with. If something feels wrong before, during, or after a booking, contact JetSet support.",
      },
      {
        question: "What happens if there is a serious safety concern?",
        answer:
          "Families should contact local emergency services first if anyone is in immediate danger.\n\nAfter that, report the issue to JetSet support so the account can be reviewed.",
      },
    ],
  },
  {
    category: "Partner Questions",
    intro:
      "A dedicated section for providers who want to apply, complete onboarding, and understand JetSet expectations.",
    items: [
      {
        question: "How do I become a JetSet partner?",
        answer:
          "You can apply through the Become a Partner page.\n\nYou will be asked to create a profile, choose your service category, select your country and city, list your experience, upload identification if required, add photos, choose your languages, and complete any required review steps.",
      },
      {
        question: "Can anyone become a partner?",
        answer:
          "No. JetSet reviews partners to maintain platform quality and trust.\n\nPartners should be warm, professional, reliable, responsive, and honest about their experience.",
      },
      {
        question: "Can partners log in before they are approved?",
        answer:
          "Yes. Partners should always be able to log in.\n\nIf a partner is still under review, their account may not be visible to families yet, but they should still be able to complete their onboarding steps.",
      },
      {
        question: "Do partners have to upload identification?",
        answer:
          "Yes, partners may be required to upload identification as part of the review process.\n\nThis helps JetSet maintain trust and platform safety.",
      },
      {
        question: "Can partners choose which city they want to work in?",
        answer:
          "Yes. Partners should be able to list their country of origin, current country, current city, the city where they want to offer services, languages they speak, and whether they are a local or an expat.\n\nThis helps families understand the partner's background and language strengths.",
      },
      {
        question: "Can partners offer more than one service?",
        answer:
          "Yes, if they are qualified.\n\nFor example, someone may offer childcare and pet care, but each service should be listed honestly and reviewed properly.",
      },
      {
        question: "Can JetSet guarantee bookings or income?",
        answer:
          "No. JetSet does not guarantee approval, bookings, income, or repeat clients.\n\nThe ambassador guidance is clear that no one should promise providers approval, guaranteed bookings, or income before JetSet has officially confirmed anything.",
      },
      {
        question: "What makes a strong JetSet partner profile?",
        answer:
          "A strong profile includes clear photos, a warm introduction, relevant experience, languages spoken, service areas, age groups served, availability, certifications or training, badges earned, references if requested, fast response time, and professional communication.",
      },
      {
        question: "What are JetSet badges?",
        answer:
          "Badges help families quickly understand a partner's experience, training, and specialties.\n\nExamples may include infant care, special needs care, hotel babysitting, pet care, language skills, LGBTQ+ Affirming, first aid, or other specialty badges.",
      },
      {
        question: "Can a partner lose access to JetSet?",
        answer:
          "Yes. JetSet may remove, pause, or restrict a partner account for safety concerns, dishonesty, repeated cancellations, poor conduct, fake documents, harassment, off platform booking violations, or other violations of JetSet policies.",
      },
    ],
  },
  {
    category: "Booking and Payment Questions",
    intro:
      "Clear answers around membership, Trusted Booking Fees, refunds, and how JetSet keeps payment records structured.",
    items: [
      {
        question: "How do payments work?",
        answer:
          "When you book through JetSet, you pay a Trusted Booking Fee online to confirm your booking. This fee covers identity verification, ID checks, customer support, secure messaging, reviews, trust badges, and platform maintenance.\n\nThe caregiver's service fee is paid directly to the caregiver at the time of service, using cash or another locally agreed payment method.",
      },
      {
        question: "Do I pay the caregiver through JetSet?",
        answer:
          "No. You pay the caregiver directly at the time of service. JetSet only collects the Trusted Booking Fee to confirm and secure your booking.\n\nThis means caregivers receive their payment immediately, with no waiting for payouts.",
      },
      {
        question: "What payment processor does JetSet use?",
        answer:
          "JetSet uses Stripe for processing the Trusted Booking Fee online. The caregiver's service fee is paid directly to the caregiver in person.",
      },
      {
        question: "What is the JetSet Cares Starter Membership?",
        answer:
          "The JetSet Cares Starter Membership begins at $24.99 per month.\n\nThis membership is designed for families who want access to trusted childcare and pet care partners, lower booking fees, member benefits, and a smoother experience when finding care in unfamiliar cities.\n\n6 Month Membership: $129.99 every 6 months\nAnnual Membership: $249.99 per year",
      },
      {
        question: "What are the Trusted Booking Fees?",
        answer:
          "Non Member Trusted Booking Fee: 25%\nMember Trusted Booking Fee: 12.5%\n\nMembers pay half the Trusted Booking Fee compared to non members. This means more savings on every booking when you become a JetSet Cares member.\n\nThe Trusted Booking Fee pays for identity verification, ID checks, customer support, secure messaging, reviews, trust badges, and platform maintenance.",
      },
      {
        question: "Why become a member?",
        answer:
          "Members pay only a 12.5% Trusted Booking Fee instead of the standard 25% non member fee. Members may also receive access to premium features, loyalty benefits, badges, or early access perks as the platform grows.",
      },
      {
        question: "Can I use JetSet without a membership?",
        answer:
          "Yes. Families can book without a membership, but non members pay a 25% Trusted Booking Fee instead of the member rate of 12.5%.",
      },
      {
        question: "Are refunds available?",
        answer:
          "Refunds depend on the booking details, cancellation timing, partner policy, and JetSet's refund rules.\n\nFamilies should review the cancellation policy before booking.",
      },
    ],
  },
  {
    category: "Care Categories",
    intro:
      "A quick overview of the kinds of services JetSet plans to make discoverable across launch cities.",
    items: [
      {
        question: "What childcare services are available?",
        answer:
          "Childcare may include hotel babysitting, date night care, weekend care, infant care, toddler care, school age care, special needs care, LGBTQ+ affirming care, homeschool or learning support, travel family support, and emergency or short notice care when available.",
      },
      {
        question: "What pet care services are available?",
        answer:
          "Pet care may include pet sitting, dog walking, feeding visits, cat care, hotel pet support, basic pet companionship, and short term travel pet care.\n\nAvailability depends on the city and approved partners.",
      },
    ],
  },
];

const highlights = [
  {
    title: "Human-reviewed answers",
    description: "The page is structured so families and partners can find answers without digging through long paragraphs.",
    icon: ShieldCheck,
  },
  {
    title: "Trust-first navigation",
    description: "Grouped by real user intent like safety, family onboarding, partner approval, and payments.",
    icon: HeartHandshake,
  },
  {
    title: "Faster decisions",
    description: "Category jump links and clear sections make the page feel more like a product guide than a plain FAQ.",
    icon: Sparkles,
  },
];

const totalQuestions = faqGroups.reduce(
  (count, group) => count + group.items.length,
  0
);

const Faq = () => {
  return (
    <div className="bg-[#f4fbfd] text-slate-900 mt-20">
      <section className="relative overflow-hidden bg-[#062c43] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(62,224,207,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(95,168,255,0.25),_transparent_30%)]" />
        <div className="absolute left-8 top-10 h-28 w-28 rounded-full border border-white/15 bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 translate-x-1/4 translate-y-1/4 rounded-full bg-[#3ee0cf]/20 blur-3xl" />

        <div className="container relative">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
                <MessageCircleQuestion className="h-4 w-4 text-[#7cebdd]" />
                Help center for families and partners
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Answers that feel calm, clear, and built around trust.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                We turned the old homepage FAQ into a full destination page so
                people can browse by topic, understand the platform faster, and
                move forward with confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="#faq-directory"
                  className="inline-flex items-center gap-2 rounded-full bg-[#3ee0cf] px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#7cebdd]"
                >
                  Browse Questions
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Back to Home
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm text-slate-300">Question sets</p>
                    <p className="mt-2 text-3xl font-semibold">
                      {faqGroups.length}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm text-slate-300">Live answers</p>
                    <p className="mt-2 text-3xl font-semibold">
                      {totalQuestions}+
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-[#041f31]/70 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-[#7cebdd]">
                    Top topics
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {faqGroups.slice(0, 4).map((group) => (
                      <a
                        key={group.category}
                        href={`#${group.category
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}`}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 transition-colors hover:bg-white/10"
                      >
                        {group.category}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#9deee5] bg-white p-6 text-slate-900 shadow-[0_20px_60px_rgba(6,44,67,0.15)]">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[#dffaf7] p-3 text-[#0b7c72]">
                    <BadgeCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      Built for support, not clutter
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      This page now works as a proper support hub, which also
                      gives the homepage more breathing room.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-[#d7efee] bg-white p-6 shadow-[0_18px_50px_rgba(6,44,67,0.08)]"
              >
                <div className="inline-flex rounded-2xl bg-[#dffaf7] p-3 text-[#0b7c72]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[#062c43]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq-directory"
        className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24"
      >
        <div className="container">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0b7c72]">
                FAQ Directory
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#062c43] sm:text-4xl">
                Find the right section first, then open the details you need.
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {faqGroups.map((group) => (
                <a
                  key={group.category}
                  href={`#${group.category
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}`}
                  className="rounded-full border border-[#b7ece6] bg-white px-4 py-2 text-sm font-medium text-[#0b7c72] transition-all hover:-translate-y-0.5 hover:border-[#3ee0cf] hover:bg-[#edfffc]"
                >
                  {group.category}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {faqGroups.map((group, groupIndex) => {
              const sectionId = group.category
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");

              return (
                <section
                  key={group.category}
                  id={sectionId}
                  className="overflow-hidden rounded-[32px] border border-[#d7efee] bg-white shadow-[0_24px_80px_rgba(6,44,67,0.08)]"
                >
                  <div className="border-b border-[#dff1f0] bg-[linear-gradient(135deg,rgba(6,44,67,0.04),rgba(62,224,207,0.08))] px-6 py-7 sm:px-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0b7c72]">
                          Section {groupIndex + 1}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-[#062c43] sm:text-3xl">
                          {group.category}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                          {group.intro}
                        </p>
                      </div>

                      <div className="inline-flex h-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#3ee0cf]" />
                        {group.items.length} questions
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 sm:px-8 sm:py-4">
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue={`${sectionId}-0`}
                      className="space-y-4"
                    >
                      {group.items.map((faq, index) => (
                        <AccordionItem
                          key={`${group.category}-${index}`}
                          value={`${sectionId}-${index}`}
                          className="overflow-hidden rounded-[24px] border border-[#d9ecea] bg-[#fbffff] px-5 data-[state=open]:border-[#8be7dc] data-[state=open]:bg-white"
                        >
                          <AccordionTrigger className="gap-4 py-5 text-left text-base font-semibold leading-7 text-[#062c43] hover:no-underline sm:text-lg">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="whitespace-pre-line pb-5 text-sm leading-7 text-slate-600 sm:text-base">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-10 rounded-[32px] bg-[#062c43] px-6 py-8 text-white shadow-[0_24px_80px_rgba(6,44,67,0.18)] sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7cebdd]">
                  Still need help?
                </p>
                <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
                  Explore the platform or review our policy pages next.
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">
                  The new FAQ page now sits as its own support destination, and
                  the footer links users directly into it from anywhere on the
                  website.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/privacy-policy"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="rounded-full bg-[#3ee0cf] px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#7cebdd]"
                >
                  Terms and Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
