"use client";
import { Button } from "@/components/ui/button";
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
      className="h-[45px] w-full overflow-hidden rounded-xl bg-[#3ee0cf] font-semibold text-slate-950 shadow-sm shadow-[#3ee0cf]/25 transition-all duration-300 hover:bg-[#25c8b9] hover:shadow-md hover:shadow-[#3ee0cf]/30 disabled:cursor-not-allowed disabled:opacity-90"
    >
      {isPending ? (
        <div className="flex items-center justify-center gap-2.5">
          <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-2 border-dashed border-slate-950/85 animate-spin" />
            <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
          </span>
          <div>{title}</div>
        </div>
      ) : (
        `${title}`
      )}
    </Button>
  );
};

export default Loader;
