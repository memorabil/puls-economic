import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getBnrIndicators } from "./bnr-indicators.functions";

export function useBnrIndicators() {
  const fn = useServerFn(getBnrIndicators);
  return useQuery({
    queryKey: ["bnr", "indicators"],
    queryFn: () => fn(),
    staleTime: 1000 * 60 * 60 * 12,
    refetchOnWindowFocus: false,
  });
}
