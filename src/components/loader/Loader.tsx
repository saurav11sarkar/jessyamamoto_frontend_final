"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import React from "react";

const Loader = ({
  isPending,
  title,
}: {
  isPending: boolean;
  title: string;
}) => {
  return (
    <Button
      disabled={isPending}
      type="submit"
      className="h-[45px] w-full  text-white disabled:cursor-not-allowed"
    >
      {isPending ? (
        <div className="flex items-center gap-1">
          <div>
            <Spinner />
          </div>

          <div>{title}</div>
        </div>
      ) : (
        `${title}`
      )}
    </Button>
  );
};

export default Loader;
