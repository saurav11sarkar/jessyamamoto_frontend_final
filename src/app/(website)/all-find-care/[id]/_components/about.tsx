import React from "react";

interface AboutProps {
  experience: number;
  bio: string;
}

const About = ({
  experience,
  bio,
}: AboutProps) => {
  return (
    <div className="container space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-lg">About</h1>
        <p className="text-sm">
          <span className="font-medium">Experience:</span>{" "}
          <span className="opacity-75">
            {experience} {experience === 1 ? "year" : "years"}
          </span>
        </p>
        <p className="text-sm opacity-75">{bio}</p>
      </div>
    </div>
  );
};

export default About;
