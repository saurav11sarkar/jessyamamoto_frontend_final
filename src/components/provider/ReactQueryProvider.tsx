"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState, Suspense } from "react";
import { SocketProvider } from "./SocketContext";
import { ThemeProvider } from "./ThemeProvider";

// Loading component for Suspense
function ProviderLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Prevent QueryClient from being recreated on each render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <SocketProvider>
            <Suspense fallback={<ProviderLoading />}>{children}</Suspense>
          </SocketProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
