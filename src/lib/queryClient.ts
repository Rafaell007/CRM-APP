import { QueryClient } from "@tanstack/react-query";


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // data counts as fresh for 1 minute, so no refetch on every page change
    },
  },
});
