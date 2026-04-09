import { formatPrice } from "../products/productUtils";

export { formatPrice };

export const getPlanLabel = (visitsPerYear: number): string => {
  if (visitsPerYear === 1) return "1 visite/an";
  return `${visitsPerYear} visites/an`;
};
