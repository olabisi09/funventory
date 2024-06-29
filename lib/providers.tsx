"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Providers = ({ children }: React.PropsWithChildren) => {
  const { toast } = useToast();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
          mutations: {
            onError: (error: Error) => {
              toast({
                title: "Error",
                description: error?.message,
                variant: "destructive",
              });
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
