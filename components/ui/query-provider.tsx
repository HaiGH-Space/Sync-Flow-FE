'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSocketSync } from "@/hooks/use-socket-sync";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    }
  }, 
});

export default function QueryProvider({children}: {children: React.ReactNode}) {
  useSocketSync();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}