import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  const forFamilies = [
    { name: "Find Care", href: "/#categories" },
    { name: "Cities", href: "/#cities" },
    { name: "Membership", href: "/membership" },
    { name: "FAQ", href: "/faq" },
  ];

  const forPartners = [
    { name: "Become a Partner", href: "/find-job/1?role=find job" },
    { name: "Partner Resources", href: "/faq" },
    { name: "Partner Login", href: "/login" },
  ];

  const company = [
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Blog", href: "/blog" },
  ];

  const legal = [
    { name: "Terms of Service", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "FAQ", href: "/faq" },
  ];

  const socialIcons = [
    { Icon: Facebook, href: "https://www.facebook.com/jetsetcares", label: "Facebook" },
    { Icon: Instagram, href: "https://www.instagram.com/jetsetcare", label: "Instagram" },
    { Icon: Youtube, href: "https://youtube.com/@jetsetcares", label: "YouTube" },
    { Icon: Mail, href: "mailto:support@jetsetcares.org", label: "Email" },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0A2B3E] to-[#061D2B] pt-16 pb-8">
      <div className="container px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/jetset-logo.webp"
                alt="JetSet Cares"
                width={80}
                height={80}
                className="h-[80px] w-[80px] object-cover brightness-0 invert"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
              Trusted care for families traveling, relocating, and living abroad.
            </p>
            <div className="mt-5 flex gap-3">
              {socialIcons.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-all hover:bg-[#00D1C1] hover:text-white"
                >
                  <item.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#00D1C1]">
              For Families
            </h4>
            <ul className="space-y-2.5">
              {forFamilies.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#00D1C1]">
              For Partners
            </h4>
            <ul className="space-y-2.5">
              {forPartners.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#00D1C1]">
              Company
            </h4>
            <ul className="space-y-2.5">
              {company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#00D1C1]">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500">support@jetsetcares.org</p>
              <p className="mt-1 text-xs text-gray-500">+44 204 634 5573</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-gray-500">
            {new Date().getFullYear()} JetSet Cares. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
