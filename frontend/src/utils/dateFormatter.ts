import { format, parseISO } from "date-fns";

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy • hh:mm a");
    // Example: "Nov 15, 2025 • 09:11 AM"
  } catch {
    console.error("Invalid date string:", dateString);
    return dateString;
  }
};

export const formatDateOnly = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy");
    // Example: "Nov 15, 2025"
  } catch {
    console.error("Invalid date string:", dateString);
    return dateString;
  }
};

export const formatTimeOnly = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = parseISO(dateString);
    return format(date, "hh:mm a");
    // Example: "06:11 AM"
  } catch {
    console.error("Invalid date string:", dateString);
    return dateString;
  }
};
