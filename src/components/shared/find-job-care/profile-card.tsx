import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

interface ProfileCardType {
  image: string;
  title: string;
  tags: string[];
  bio: string;
  hourRate?: number;
  location?: string;
  id?: string;
}

const ProfileCard = ({
  image,
  title,
  tags = [],
  bio,
  hourRate,
  location,
  id,
}: ProfileCardType) => {
  const pathName = usePathname();
  const [imageSrc, setImageSrc] = useState(image || "/placeholder.png");

  React.useEffect(() => {
    setImageSrc(image || "/placeholder.png");
  }, [image]);

  const truncateBio = (text: string, maxLength: number = 150) => {
    if (text?.length <= maxLength) return text;
    return text?.substr(0, maxLength).lastIndexOf(" ") > 0
      ? text?.substr(0, text.substr(0, maxLength).lastIndexOf(" ")) + "..."
      : text?.substr(0, maxLength) + "...";
  };

  const displayBio = truncateBio(bio);

  const formatLocation = (locationString?: string) => {
    if (!locationString) return null;
    const parts = locationString.split(",");
    return parts.slice(0, 3).join(",").trim();
  };

  const formattedLocation = formatLocation(location);

  return (
    <div>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col gap-6 relative">
        {/* Top Section: Image and Info */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <Image
              src={imageSrc}
              alt={`${title}'s profile`}
              width={1000}
              height={1000}
              onError={() => setImageSrc("/placeholder.png")}
              className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover shadow-sm"
            />
          </div>

          {/* Title and Tags */}
          <div className="flex flex-col gap-4 flex-1">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#001D3D] leading-tight">
              {title}
            </h2>

            {/* Tags/Pills Container */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {/* Show location tag if available */}
              {formattedLocation && (
                <span className="bg-[#E9E9E9] text-[#333333] px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {formattedLocation}
                </span>
              )}

              {/* Show other tags */}
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#E9E9E9] text-[#333333] px-4 py-1.5 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}

              {/* Show hourly rate if available and not already in tags */}
              {hourRate && !tags.some((tag) => tag.includes("$/hr")) && (
                <span className="bg-[#E9E9E9] text-[#333333] px-4 py-1.5 rounded-full text-sm font-medium">
                  ${hourRate}/hr
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Description and Button */}
        <div className="space-y-4">
          <p className="text-[#4A4A4A] text-base md:text-lg leading-relaxed max-w-[80%]">
            {displayBio}
            {bio?.length > 150 && (
              <Link
                href={
                  pathName === "/all-find-jobs"
                    ? `/all-find-jobs/${id}`
                    : `/all-find-care/${id}`
                }
                className="text-primary font-bold underline ml-1 hover:text-[#001D3D] transition-colors"
              >
                read more
              </Link>
            )}
          </p>

          {/* See Profile Button - Absolute positioned on desktop for precise alignment */}
          <div className="md:absolute md:bottom-8 md:right-8 flex justify-end">
            <Link
              href={
                pathName === "/all-find-jobs"
                  ? `/all-find-jobs/${id}`
                  : `/all-find-care/${id}`
              }
            >
              <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary transition-all shadow-md active:scale-95">
                See Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
