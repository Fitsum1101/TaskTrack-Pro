// src/hooks/useCurrentRouteSegment.ts
import { useLocation } from "react-router-dom";

export const useCurrentRouteSegment = (): string => {
  const location = useLocation();

  const pathname = location.pathname;

  // Split the path and remove empty strings
  const segments = pathname.split("/").filter(Boolean);

  // Return last segment or empty string if none
  return segments.length > 0 ? segments[segments.length - 1] : pathname;
};
