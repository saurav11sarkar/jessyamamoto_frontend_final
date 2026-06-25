"use client";

import { Button } from "@/components/ui/button";
import { FindJobDataTypes } from "../find-job-data-type";

interface SummaryStepProps {
  data: FindJobDataTypes;
  onBack: () => void;
}

export function SummaryStep({ data, onBack }: SummaryStepProps) {

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Account Created!
        </h1>

        <div className="space-y-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Name :</span>
              <span>
                {data.firstName} {data.lastName}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Email :</span>
              <span className="text-sm">{data.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Gender :</span>
              <span className="text-sm capitalize">{data.gender}</span>
            </div>

            {/* <div className="flex justify-between">
              <span className="font-medium">NID Number :</span>
              <span className="text-sm">
                {data.nidNumber || "Not provided"}
              </span>
            </div> */}

            <div className="flex justify-between">
              <span className="font-medium">Location :</span>
              <span>
                {data.country}, {data.city}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Hourly Rate :</span>
              <span>${data.hourRate}/hour</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Days :</span>
              <span className="text-sm">
                {data.days?.day?.join(", ") || "Not selected"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Times :</span>
              <span className="text-sm">
                {data.days?.time?.join(", ") || "Not selected"}
              </span>
            </div>
          </div>

          <p className="text-sm text-center text-gray-600">
            Please review your information above.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 rounded-full"
          >
            Back
          </Button>

          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
