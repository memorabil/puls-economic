import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getBnrToday, getBnrHistory } from "./bnr.functions";

export function useBnrToday() {
  const fn = useServerFn(getBnrToday);
  return useQuery({
    queryKey: ["bnr", "today"],
    queryFn: () => fn(),
    staleTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
  });
}

export function useBnrHistory(years = 1) {
  const fn = useServerFn(getBnrHistory);
  return useQuery({
    queryKey: ["bnr", "history", years],
    queryFn: () => fn({ data: { years } }),
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });
}
