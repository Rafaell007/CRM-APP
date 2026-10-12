


export const formatDate = (isoString: string | undefined | null) : string => {
  if (!isoString) return "—";

  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};