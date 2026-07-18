import React, { useMemo } from "react";
import { Award, CheckCircle2, ShieldCheck } from "lucide-react";

interface ServiceDetailsProps {
  ageGroups: string[];
  canHelpWith: string[];
  education: string[];
  professionalSkills: string[];
  experiences?: string[];
  certifications?: string[];
  languages: Array<string | { language?: string; proficiency?: string; isNative?: boolean }>;
  hourlyRate: number;
  hideRate?: boolean;
  days: ServiceDay[];
  categoryName?: string;
  categoryDescription?: string;
}

interface ServiceDay {
  day: string;
  startTime: string;
  endTime: string;
  _id: string;
}

export const ServiceDetails = ({
  ageGroups = [],
  canHelpWith = [],
  education = [],
  professionalSkills = [],
  experiences = [],
  certifications = [],
  languages = [],
  hourlyRate = 0,
  hideRate = false,
  days = [],
  categoryName = "",
  categoryDescription = "",
}: ServiceDetailsProps) => {
  const formatDay = (day: string) => {
    return day.slice(0, 3);
  };

  const formatTime = (time: string) => {
    return time;
  };

  // Fix: Array.from ব্যবহার করুন
  const uniqueEducation = useMemo(() => {
    return Array.from(new Set(education));
  }, [education]);

  const displayLanguages = useMemo(
    () =>
      languages
        .map((item) =>
          typeof item === "string"
            ? item
            : [item.language, item.proficiency].filter(Boolean).join(" - "),
        )
        .filter(Boolean),
    [languages],
  );

  const trustBadges = useMemo(
    () =>
      [
        ...experiences.map((item) => ({ label: item, icon: Award })),
        ...certifications.map((item) => ({ label: item, icon: ShieldCheck })),
      ].filter((item) => item.label),
    [experiences, certifications],
  );

  return (
    <div className="container text-[#1a1a1a] pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left & Center Column */}
        <div className="md:col-span-2 space-y-10">
          {/* Services */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Services</h2>

            {trustBadges.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {trustBadges.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <span
                      key={`${badge.label}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[#9aece3] bg-[#ecfffd] px-3 py-1.5 text-sm font-semibold text-[#087c73]"
                    >
                      <Icon className="h-4 w-4" />
                      {badge.label}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Age Groups */}
            {ageGroups.length > 0 && (
              <>
                <h3 className="text-sm font-semibold mb-3">Age groups</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {ageGroups.map((group, i) => (
                    <span
                      key={i}
                      className={`px-4 py-2 rounded-full border text-sm ${
                        i === 0
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-blue-600 text-blue-600"
                      }`}
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Rates */}
            {!hideRate && (
              <>
                <h3 className="text-sm font-semibold mb-3">Rates</h3>
                <div className="space-y-2 max-w-xs text-sm">
                  <div className="flex justify-between">
                    <span>Hourly rate</span>
                    <span className="font-medium">${hourlyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recurring jobs</span>
                    <span className="font-medium">Contact for rates</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional children</span>
                    <span className="font-medium">Contact for rates</span>
                  </div>
                </div>
              </>
            )}

            {/* Category Info */}
            {categoryName && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Service Category</h3>
                <p className="text-sm text-gray-700">{categoryName}</p>
                {categoryDescription && (
                  <p className="text-sm text-gray-500 mt-1">
                    {categoryDescription}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Qualifications */}
          {(education.length > 0 ||
            professionalSkills.length > 0 ||
            displayLanguages.length > 0) && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Qualifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {education.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Education</h3>
                    {uniqueEducation.map((edu, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-sm text-gray-700">{edu}</p>
                      </div>
                    ))}
                  </div>
                )}

                {professionalSkills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      Professional skills
                    </h3>
                    {professionalSkills.map((skill, index) => (
                      <p key={index} className="text-sm text-gray-700 mb-1">
                        {skill}
                      </p>
                    ))}
                  </div>
                )}

                {displayLanguages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      Languages spoken
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {displayLanguages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full border border-blue-600 text-blue-600 text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Availability */}
          {days.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">
                Contact to check availability
              </h2>
              <div className="space-y-3">
                {days.map((item, i) => (
                  <div key={item._id || i} className="flex gap-20 text-sm">
                    <span className="font-semibold w-8">
                      {formatDay(item.day)}
                    </span>
                    <span className="text-gray-700">
                      {formatTime(item.startTime)} – {formatTime(item.endTime)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Help Items */}
        {canHelpWith.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-semibold mb-4">Can help with</h3>
            <ul className="space-y-3">
              {canHelpWith.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <CheckCircle2
                    size={18}
                    className="text-gray-800"
                    strokeWidth={1.5}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
