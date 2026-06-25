import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | JetSet Cares",
  description:
    "JetSet Cares Terms and Conditions governing access to and use of the platform.",
};

const termsSections = [
  {
    title: "1. About JetSet Cares",
    paragraphs: [
      "JetSet Cares is a trust based marketplace designed to help families traveling, living, working, or raising children abroad connect with independent childcare providers and selected support providers in approved cities.",
      "JetSet Cares may include childcare, pet care, and selected home support categories. Childcare is the primary focus of the platform.",
      "JetSet Cares is a platform. JetSet Cares does not directly employ providers unless a separate written employment agreement is signed. Providers listed on JetSet Cares are independent service providers and are not employees, agents, joint venture partners, or representatives of JetSet Cares.",
      "JetSet Cares helps facilitate discovery, communication, booking, payment, provider presentation, training, badges, and trust signals, but families remain responsible for making their own final hiring and care decisions.",
    ],
  },
  {
    title: "2. Important Safety Notice",
    paragraphs: [
      "JetSet Cares is designed to support trust, safety, and better care decisions, but no platform can guarantee that every user, provider, family, booking, message, document, badge, review, or interaction will be risk free.",
      "Families are responsible for reviewing provider profiles, asking appropriate questions, checking references where desired, confirming qualifications, sharing necessary care instructions, and making the final decision about whether a provider is suitable for their family.",
      "Providers are responsible for accurately representing their experience, skills, qualifications, background, availability, rates, and services.",
      "If there is an emergency, immediate danger, child safety concern, medical emergency, threat, or criminal conduct, users should contact local emergency services or local authorities immediately. JetSet Cares customer support is not an emergency response service.",
    ],
  },
  {
    title: "3. Eligibility",
    paragraphs: [
      "To use JetSet Cares, you must be at least 18 years old or the age of legal majority in your country of residence, whichever is higher.",
      "You may use JetSet Cares only if you can legally enter into a binding agreement.",
      "You may not use JetSet Cares if you are legally prohibited from using the platform, have previously been suspended or removed from JetSet Cares, provide false or incomplete information, attempt to use the platform for unsafe or unlawful purposes, or fail to meet legal registration, licensing, or disclosure requirements before providing care.",
      "JetSet Cares may refuse, suspend, restrict, or terminate access at any time if we believe a user may pose a safety, legal, fraud, platform integrity, or reputational risk.",
    ],
  },
  {
    title: "4. Account Registration",
    paragraphs: [
      "Users may be required to create an account to access certain features.",
      "You agree to provide accurate, current, and complete information and to keep your account information updated.",
      "You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.",
      "You may not share your account, sell your account, create fake accounts, impersonate another person, or create an account on behalf of another person without authorization.",
      "You must notify JetSet Cares immediately if you believe your account has been accessed without permission.",
    ],
  },
  {
    title: "5. Family Accounts",
    paragraphs: [
      "Family accounts may be used by parents, guardians, or authorized adults seeking childcare, pet care, or approved support services.",
      "Families agree to provide accurate booking details, disclose important care instructions, share relevant allergy, medical, safety, behavioral, language, or access information when necessary for safe care, treat providers respectfully, pay all required fees, use platform messaging and booking tools appropriately, supervise the booking process, make final care decisions, and comply with local laws, hotel policies, housing rules, immigration rules, and other applicable requirements.",
      "Families may not use JetSet Cares to request illegal, unsafe, exploitative, discriminatory, abusive, sexual, violent, or inappropriate services.",
    ],
  },
  {
    title: "6. Provider Accounts",
    paragraphs: [
      "Providers may apply to offer services through JetSet Cares. Applying does not guarantee approval.",
      "JetSet Cares may manually review provider applications and may request identity documents, references, profile information, certifications, background check information, training completion, interviews, or other verification materials.",
      "Providers agree to provide accurate information, submit only real and valid documents, keep profiles updated, honor accepted bookings, communicate professionally, arrive on time, provide services safely and responsibly, follow family instructions within reasonable and lawful limits, comply with local laws and licensing requirements, maintain required permits, visas, work authorization, training, insurance, certifications, or qualifications, avoid unsafe or inappropriate conduct, and report serious safety concerns to JetSet Cares and, when needed, local authorities.",
      "JetSet Cares may approve, reject, suspend, remove, hide, or restrict provider profiles at its discretion.",
    ],
  },
  {
    title: "7. Provider Independence",
    paragraphs: [
      "Providers are independent service providers. Nothing in these Terms creates an employment, agency, partnership, joint venture, franchise, or representative relationship between JetSet Cares and any provider.",
      "Providers control the services they offer, their availability, whether to accept a booking, and the manner of performing their services, subject to platform rules, safety standards, family instructions, and applicable law.",
      "Providers are responsible for their own taxes, insurance, permits, licensing, work authorization, benefits, expenses, equipment, transportation, and legal compliance.",
      "JetSet Cares does not control or guarantee the quality, legality, safety, suitability, conduct, or performance of any provider.",
    ],
  },
  {
    title: "8. Provider Verification and Badges",
    paragraphs: [
      "JetSet Cares may offer provider verification, badges, JetSet Academy training, specialty indicators, family recommendation markers, LGBTQ+ affirming care badges, experience badges, language indicators, or other trust signals.",
      "Badges and verification indicators are intended to help families make more informed decisions. They are not guarantees.",
      "A badge does not guarantee future performance, safety, legal compliance, personality fit, emergency readiness, or suitability for a specific child or family.",
      "JetSet Cares may remove, revoke, pause, or modify badges at any time if information becomes inaccurate, incomplete, expired, disputed, or inconsistent with platform standards.",
      "Providers may not falsely claim badges, certifications, background checks, approvals, training, or affiliation with JetSet Cares.",
    ],
  },
  {
    title: "9. Bookings",
    paragraphs: [
      "Bookings may be requested, accepted, modified, canceled, or completed through the platform. A booking is not confirmed until the platform shows confirmation or both parties have completed the required booking steps.",
      "Families are responsible for reviewing booking details before confirming. Providers are responsible for reviewing booking details before accepting.",
      "Booking details may include service category, date and time, location, number and age of children, pet details if applicable, special instructions, provider rate, Trusted Booking Fees, membership rate or non member rate, cancellation terms, payment amount, and any additional terms shown at checkout.",
      "Users should not rely on off platform conversations to change booking terms unless the changes are also confirmed through the platform.",
    ],
  },
  {
    title: "10. Payments",
    paragraphs: [
      "JetSet Cares may process payments through third party payment processors, including Stripe, Apple, Google, or other approved processors.",
      "Users agree to pay all applicable charges, including JetSet Cares Trusted Booking Fees, membership fees, subscription fees, cancellation fees, late fees if applicable, taxes if applicable, currency conversion charges if applicable, and payment processor fees if applicable. Caregiver service fees are paid directly to the caregiver at the time of service.",
      "JetSet Cares does not directly store full credit card numbers. Payment processing is subject to the payment processor's own terms and policies.",
      "JetSet Cares may charge the payment method on file when a booking is confirmed, when a membership renews, when a cancellation fee applies, or when another authorized charge is due.",
    ],
  },
  {
    title: "11. Trusted Booking Fees",
    paragraphs: [
      "JetSet Cares charges a Trusted Booking Fee to families when a booking is confirmed. This fee pays for identity verification, ID checks, customer support, secure messaging, reviews, trust badges, and platform maintenance. Trusted Booking Fees may vary depending on membership status, city, service type, promotional offer, payment method, currency, booking value, or other factors shown at checkout.",
      "Current or planned pricing may include different rates for members and non members. The exact amount displayed at checkout controls the transaction.",
      "JetSet Cares may change fees at any time. Fee changes will not affect already confirmed bookings unless disclosed and permitted by law.",
      "Caregiver service fees are not collected by JetSet Cares. Families pay caregivers directly at the time of service using cash or another locally agreed payment method.",
    ],
  },
  {
    title: "12. Memberships and Subscriptions",
    paragraphs: [
      "JetSet Cares may offer paid memberships or subscriptions that provide benefits such as reduced Trusted Booking Fees, premium features, access to certain booking tools, discounts, loyalty rewards, or other benefits.",
      "Memberships may be offered monthly, quarterly, annually, or under other plans. Unless otherwise stated at purchase, memberships may automatically renew until canceled.",
      "Users are responsible for canceling memberships before the renewal date if they do not want to continue. Membership fees are generally non refundable unless required by law or expressly stated by JetSet Cares.",
      "If a membership is purchased through Apple App Store or Google Play, cancellation and refund requests may need to be handled through Apple or Google according to their policies.",
      "JetSet Cares may modify, pause, remove, or replace membership benefits at any time, but will not intentionally remove core paid benefits from an active billing period without a reasonable replacement, credit, notice, or legally required remedy.",
    ],
  },
  {
    title: "13. App Store and Mobile App Terms",
    paragraphs: [
      "If you download the JetSet Cares app through Apple App Store or Google Play, your use of the app may also be subject to Apple's or Google's applicable terms, rules, and payment policies.",
      "Apple and Google are not responsible for JetSet Cares services, bookings, providers, customer support, disputes, payments made outside their systems, care services, or marketplace activity.",
      "If JetSet Cares provides a custom end user license agreement for the app, that agreement may apply in addition to these Terms. If no custom end user license agreement is provided for the Apple version of the app, Apple's standard licensed application end user license agreement may apply to the app license.",
    ],
  },
  {
    title: "14. Cancellations, No Shows, and Refunds",
    paragraphs: [
      "JetSet Cares may provide cancellation rules at checkout or in a separate cancellation policy.",
      "Unless otherwise stated, families should cancel as early as possible if they no longer need a booking, providers should cancel only when necessary and should give as much notice as possible, repeated cancellations may result in account review, restrictions, or suspension, no shows may result in fees or account action, and refunds may depend on timing, preparation, travel time, service type, processor rules, and platform policy.",
      "JetSet Cares may issue refunds, credits, partial refunds, or no refund at its discretion, subject to applicable law and the specific cancellation terms shown for the booking.",
      "If a safety issue, fraud issue, emergency, provider no show, family no show, payment failure, or policy violation occurs, JetSet Cares may review the situation and decide whether a refund, credit, fee, restriction, or other action is appropriate.",
    ],
  },
  {
    title: "15. Off Platform Booking and Payment",
    paragraphs: [
      "JetSet Cares invests in trust, provider onboarding, messaging, safety review, payment infrastructure, and marketplace visibility.",
      "Users may not use JetSet Cares to identify, contact, or meet another user and then avoid Trusted Booking Fees by arranging the same or related services outside the platform.",
      "Users may not arrange bookings outside the platform to avoid paying the Trusted Booking Fee. This includes making repeat bookings directly with a caregiver discovered through JetSet Cares, or using private messaging arrangements to bypass the platform. Paying caregivers directly in cash or another locally agreed method for their service fee is part of the JetSet Cares booking model and is permitted.",
      "Violations may result in warnings, fee recovery, account suspension, removal from the platform, loss of badges, cancellation of bookings, or other action.",
    ],
  },
  {
    title: "16. Messaging and Communications",
    paragraphs: [
      "JetSet Cares may provide messaging tools so families and providers can communicate before, during, and after bookings. Users agree to communicate respectfully and professionally.",
      "Users may not use messaging to harass, threaten, stalk, abuse, exploit, discriminate, request illegal or unsafe services, send sexual, violent, explicit, hateful, or inappropriate content, solicit off platform payments or bookings, share false or misleading information, spam, advertise unrelated services, collect personal data for unauthorized purposes, or circumvent JetSet Cares fees or policies.",
      "JetSet Cares may review messages for safety, support, dispute resolution, fraud prevention, policy enforcement, or legal compliance.",
    ],
  },
  {
    title: "17. User Conduct",
    paragraphs: [
      "Users agree not to violate any law or regulation, harm or endanger any person, child, pet, family, or provider, use the platform for trafficking, exploitation, harassment, discrimination, violence, fraud, or illegal activity, misrepresent identity or qualifications, upload false or misleading documents, create fake reviews, interfere with platform operations, scrape or misuse platform data, use JetSet Cares branding without permission, bypass payment systems, share another person's private information without authorization, provide care while impaired, bring unauthorized guests to a booking, leave children unattended unless authorized and lawful, transport children without permission, administer medication without clear written authorization and legal permission, or engage in conduct that damages JetSet Cares' reputation or user trust.",
      "JetSet Cares may investigate and take action if we believe these rules have been violated.",
    ],
  },
  {
    title: "18. Child Safety Rules",
    paragraphs: [
      "Child safety is central to JetSet Cares.",
      "Providers must never use physical punishment, verbal abuse, humiliation, threats, intimidation, unsafe conditions, unauthorized locations, unauthorized access to children, photos or videos of children without consent, public posts about a child without written consent, transportation without permission, medication without proper permission, care while impaired, or inappropriate physical, sexual, emotional, or exploitative conduct.",
      "Families must provide safe working conditions for providers and must not request unsafe, illegal, exploitative, or inappropriate care.",
      "JetSet Cares may immediately suspend accounts, cancel bookings, report concerns, preserve records, or cooperate with authorities if child safety concerns arise.",
    ],
  },
  {
    title: "19. Pet Care and Home Support",
    paragraphs: [
      "If JetSet Cares offers pet care or home support services, users agree that these services are subject to the same platform rules, payment rules, communication rules, review rules, and safety standards.",
      "Pet owners must disclose relevant pet behavior, medical, safety, feeding, access, and emergency details. Home support users must disclose relevant access, property, safety, tool, material, and job details.",
      "Providers must only accept services they are qualified, legally permitted, and physically able to perform. JetSet Cares may limit, pause, or remove certain categories by city, provider type, or launch phase.",
    ],
  },
  {
    title: "20. Reviews and Ratings",
    paragraphs: [
      "Users may be able to leave reviews, ratings, or feedback. Reviews must be truthful, relevant, respectful, and based on real experiences.",
      "Users may not post reviews that are fake, defamatory, discriminatory, threatening, abusive, obscene, private, misleading, retaliatory, or unrelated to the booking.",
      "JetSet Cares may remove, hide, edit for privacy, or decline to publish reviews that violate platform rules or legal requirements. Reviews represent the opinion of the user who posted them, not JetSet Cares.",
    ],
  },
  {
    title: "21. User Content",
    paragraphs: [
      "Users may upload content, including photos, videos, bios, messages, reviews, documents, certificates, and profile information.",
      "You retain ownership of your content, but you grant JetSet Cares a worldwide, non exclusive, royalty free license to use, host, store, reproduce, display, publish, translate, modify, and distribute your content as needed to operate, promote, improve, and protect the platform.",
      "You represent that you have the right to upload the content and that it does not violate the rights of another person.",
      "JetSet Cares may remove content that violates these Terms, the Privacy Policy, community standards, safety standards, intellectual property rights, or applicable law.",
    ],
  },
  {
    title: "22. Intellectual Property",
    paragraphs: [
      "JetSet Cares, JetSet Care, JetSet Academy, logos, badges, brand elements, designs, software, text, graphics, user interface, platform structure, training content, and related materials are owned by JetSet Care, Ltd. or its licensors.",
      "Users may not copy, reproduce, modify, sell, license, distribute, scrape, reverse engineer, imitate, or create derivative works from JetSet Cares materials without written permission.",
      "Providers may not use JetSet Cares branding, badges, logos, certificates, or profile screenshots in a misleading way or after removal from the platform.",
    ],
  },
  {
    title: "23. Third Party Services",
    paragraphs: [
      "JetSet Cares may use or link to third party services, including payment processors, identity verification providers, background check providers, app stores, map providers, analytics services, messaging services, email services, and social media platforms.",
      "JetSet Cares is not responsible for third party services, websites, policies, fees, outages, errors, or actions. Use of third party services may be subject to their own terms and privacy policies.",
    ],
  },
  {
    title: "24. Promotions, Discounts, Credits, and Rewards",
    paragraphs: [
      "JetSet Cares may offer promotional codes, discounts, referral credits, rewards, beta tester benefits, founding family benefits, provider rewards, loyalty benefits, or other promotional programs.",
      "Promotions are subject to the terms shown at the time of offer. JetSet Cares may modify, pause, revoke, or cancel promotions if there is fraud, abuse, technical error, platform misuse, or violation of these Terms.",
      "Credits and rewards have no cash value unless expressly stated. Provider rewards, including any travel, flight, badge, or recognition reward, are not guaranteed and may be subject to separate eligibility rules, performance standards, legal limits, tax requirements, and availability.",
    ],
  },
  {
    title: "25. Beta Testing and Early Access",
    paragraphs: [
      "JetSet Cares may offer beta testing, early access, founding family access, or pre launch access.",
      "Beta features may be incomplete, unstable, unavailable, changed, or removed. Users participating in beta testing agree to provide honest feedback and understand that glitches, errors, booking limitations, payment testing issues, or incomplete features may occur.",
      "JetSet Cares may provide beta benefits, but may modify or end beta access at any time.",
    ],
  },
  {
    title: "26. Disputes Between Users",
    paragraphs: [
      "JetSet Cares may help review disputes between families and providers, but JetSet Cares is not required to resolve every dispute.",
      "Users agree to cooperate with reasonable requests for information. JetSet Cares may review booking records, messages, payment records, photos, documents, reviews, and support communications when investigating disputes.",
      "JetSet Cares may decide whether to issue refunds, release payments, pause payouts, restrict accounts, remove reviews, cancel bookings, or take other platform action.",
      "JetSet Cares is not a party to the direct service relationship between a family and a provider.",
    ],
  },
  {
    title: "27. Disclaimers",
    paragraphs: [
      'JetSet Cares provides the platform on an "as is" and "as available" basis.',
      "JetSet Cares does not guarantee that the platform will always be available, secure, or error free, that a provider will be available at any specific time, that a family will book a provider, that a provider will earn any specific amount, that user information is always accurate, that verification will identify every risk, that badges guarantee quality or safety, that a booking will meet every expectation, or that services will be uninterrupted, timely, lawful, suitable, or risk free.",
      "To the fullest extent permitted by law, JetSet Cares disclaims all warranties, express or implied, including implied warranties of merchantability, fitness for a particular purpose, title, and non infringement.",
    ],
  },
  {
    title: "28. Limitation of Liability",
    paragraphs: [
      "To the fullest extent permitted by law, JetSet Cares will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, including loss of profits, loss of data, emotional distress, personal injury, property damage, lost opportunity, loss of goodwill, or service interruption arising from or related to use of the platform.",
      "To the fullest extent permitted by law, JetSet Cares' total liability for any claim related to the platform or these Terms will not exceed the greater of the amount you paid to JetSet Cares in Trusted Booking Fees during the three months before the claim arose, or one hundred United States dollars.",
      "Some jurisdictions do not allow certain liability limitations, so some limitations may not apply to you. Nothing in these Terms limits liability where it cannot legally be limited, including liability for fraud, intentional misconduct, or other liability that applicable law does not allow us to exclude.",
    ],
  },
  {
    title: "29. Indemnification",
    paragraphs: [
      "You agree to defend, indemnify, and hold harmless JetSet Care, Ltd., its directors, officers, employees, contractors, advisors, affiliates, service providers, and agents from claims, damages, losses, liabilities, costs, and expenses arising from your use of JetSet Cares, your services or bookings, your violation of these Terms, your violation of law, your violation of another person's rights, your content, your conduct with another user, your failure to pay fees or taxes, your misrepresentation of identity, qualifications, documents, background, or services, and any claim arising from care, pet care, home support, property access, injury, illness, damage, loss, or dispute connected to your booking or services.",
    ],
  },
  {
    title: "30. Suspension and Termination",
    paragraphs: [
      "JetSet Cares may suspend, restrict, hide, deactivate, or terminate an account at any time if we believe the user violated these Terms, created a safety risk, provided false or misleading information, attempted off platform booking or payment, engaged in fraud, abuse, harassment, discrimination, or illegal conduct, failed verification, received serious complaints, damaged platform trust, created legal, payment, compliance, or reputational risk, the account has been inactive, or suspension is required by law or a third party service provider.",
      "Users may stop using JetSet Cares at any time and may request account deletion according to the Privacy Policy.",
      "Termination does not eliminate obligations that arose before termination, including payment obligations, dispute obligations, tax obligations, confidentiality obligations, intellectual property obligations, liability limits, and indemnification obligations.",
    ],
  },
  {
    title: "31. Changes to the Platform",
    paragraphs: [
      "JetSet Cares may modify, pause, discontinue, or replace any part of the platform at any time. This may include changing cities, services, fees, memberships, badges, provider requirements, features, booking tools, payment methods, categories, academy content, or availability.",
      "JetSet Cares is not liable for platform changes, interruptions, or discontinued features, except where required by law.",
    ],
  },
  {
    title: "32. Changes to These Terms",
    paragraphs: [
      'JetSet Cares may update these Terms from time to time. If changes are material, we may notify users by email, in app notice, website notice, or other appropriate means. The "Last Updated" date will show when the Terms were most recently changed.',
      "Continued use of JetSet Cares after updated Terms become effective means you accept the updated Terms. If you do not agree to updated Terms, you must stop using JetSet Cares.",
    ],
  },
  {
    title: "33. Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of England and Wales, unless another governing law is required by applicable consumer protection law or local law.",
      "If JetSet Cares later adopts a different governing law for operational, regulatory, or corporate reasons, these Terms may be updated.",
    ],
  },
  {
    title: "34. Dispute Resolution",
    paragraphs: [
      "Users agree to first contact JetSet Cares at legal@jetsetcares.org and attempt to resolve any dispute informally before starting legal proceedings.",
      "If the dispute cannot be resolved informally, the dispute may be handled by the courts of England and Wales, unless applicable law requires another forum.",
      "Nothing in this section prevents JetSet Cares from seeking urgent injunctive or equitable relief to protect safety, users, children, intellectual property, confidential information, platform integrity, or legal rights.",
    ],
  },
  {
    title: "35. Local Laws and International Use",
    paragraphs: [
      "JetSet Cares may operate across multiple countries and cities.",
      "Users are responsible for complying with all applicable local laws, including laws related to childcare, employment, immigration, work authorization, business registration, licensing, taxes, consumer protection, privacy, transportation, health, safety, and child protection.",
      "JetSet Cares does not guarantee that a service, provider, booking, badge, payment method, or platform feature is lawful or available in every location.",
    ],
  },
  {
    title: "36. Privacy",
    paragraphs: [
      "Use of JetSet Cares is also governed by our Privacy Policy. The Privacy Policy explains how JetSet Cares collects, uses, shares, stores, and protects personal information. By using JetSet Cares, you agree to the Privacy Policy.",
    ],
  },
  {
    title: "37. Contact Information",
    paragraphs: [
      "For general support: support@jetsetcares.org",
      "For privacy requests: privacy@jetsetcares.org",
      "For legal notices: legal@jetsetcares.org",
      "JetSet Care, Ltd., 3rd Floor, 45 Albemarle Street, Mayfair, London, W1S 4JL, United Kingdom.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-slate-50 pt-32 pb-16 mt-10">
      <div className="container">
        <article className="mx-auto max-w-4xl">
          <div className="mb-10 border-b border-slate-200 pb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Terms and Conditions
            </p>
            <h1 className="text-4xl font-bold tracking-normal text-slate-950 md:text-5xl">
              JetSet Cares Terms and Conditions
            </h1>
            <div className="mt-6 space-y-1 text-sm text-slate-600">
              <p>Effective Date: June 14, 2026</p>
              <p>Last Updated: June 14, 2026</p>
              <p>
                These Terms and Conditions are entered into by and between you
                and JetSet Care, Ltd.
              </p>
              <p>
                Registered Office: JetSet Care, Ltd., 3rd Floor, 45 Albemarle
                Street, Mayfair, London, W1S 4JL, United Kingdom
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://www.jetsetcares.org"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  https://www.jetsetcares.org
                </a>
              </p>
              <p>
                Contact:{" "}
                <a
                  href="mailto:admin@jetsetcares.org"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  admin@jetsetcares.org
                </a>
              </p>
            </div>
          </div>

          <div className="mb-10 space-y-4 text-base leading-7 text-slate-700">
            <p>
              These Terms and Conditions govern your access to and use of JetSet
              Cares, including our website, mobile application, marketplace,
              messaging tools, provider application system, JetSet Academy,
              membership services, payment features, and any related services.
            </p>
            <p>
              By creating an account, using JetSet Cares, applying to become a
              provider, booking a service, accepting a booking, purchasing a
              membership, sending a message, or otherwise accessing the
              platform, you agree to these Terms and Conditions.
            </p>
            <p>If you do not agree, you may not use JetSet Cares.</p>
          </div>

          <div className="space-y-10">
            {termsSections.map((section) => (
              <section key={section.title} className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-7 text-slate-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>
                      {section.title === "36. Privacy" ? (
                        <>
                          Use of JetSet Cares is also governed by our{" "}
                          <Link
                            href="/privacy-policy"
                            className="font-medium text-primary underline underline-offset-4"
                          >
                            Privacy Policy
                          </Link>
                          . The Privacy Policy explains how JetSet Cares
                          collects, uses, shares, stores, and protects personal
                          information. By using JetSet Cares, you agree to the
                          Privacy Policy.
                        </>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
