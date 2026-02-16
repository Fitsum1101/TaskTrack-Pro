import { z } from "zod";
import { validationMessages as m } from "@/constant/validation-messages";
const US_PHONE_REGEX =
  /^(\+1\s?)?([2-9]\d{2}|\([2-9]\d{2}\))[-.\s]?[2-9]\d{2}[-.\s]?\d{4}$/;
const NAME_REGEX = /^[A-Za-z]+$/;

const validateUSPhone = (value: string) => {
  const cleaned = value.replace(/[\s-.]/g, "");

  // Must be numeric + optional +1
  if (!/^(\+?1)?\d{10}$/.test(cleaned)) {
    return "Phone number must contain 10 digits (with optional +1).";
  }

  // Remove +1 if present
  const digits = cleaned.startsWith("+1")
    ? cleaned.slice(2)
    : cleaned.startsWith("1")
      ? cleaned.slice(1)
      : cleaned;

  const area = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);

  if (/^[01]/.test(area)) {
    return "Area code cannot start with 0 or 1.";
  }

  if (/^[01]/.test(exchange)) {
    return "Exchange code cannot start with 0 or 1.";
  }

  return true; // Valid
};

// Helper to apply optional schema
const optional = <T extends z.ZodTypeAny>(schema: T, isRequired: boolean) =>
  isRequired ? schema : schema.optional();

// Reusable field validators
export const fieldValidators = {
  // AUTH FIELDS
  text: (isRequired = true, min = 1, max = 255) =>
    optional(
      z
        .string()
        .trim()
        .min(min, m.requiredRoleName)
        .max(max, m.requiredRoleName),
      isRequired,
    ),
  roleName: (isRequired = true, min = 1, max = 255) =>
    optional(
      z.string().trim().min(min, m.requiredText).max(max, m.requiredText),
      isRequired,
    ),
  email: (isRequired = true) =>
    optional(
      z
        .string()
        .trim()
        .min(1, m.requiredEmail)
        .email(m.invalidEmail)
        .max(255, m.maxEmail),
      isRequired,
    ),

  username: (isRequired = true) =>
    optional(
      z.string().trim().min(2, m.minLength(2)).max(50, m.maxLength(50)),
      isRequired,
    ),
  fullName: (isRequired = true) =>
    optional(
      z.string().trim().min(2, m.minLength(2)).max(50, m.maxLength(50)),
      isRequired,
    ),

  password: (min = 8, isRequired = true) =>
    optional(z.string().trim().min(min, m.minPassword), isRequired),

  otp: (isRequired = true) =>
    optional(
      z
        .string()
        .trim()
        .min(4, m.minLength(4))
        .max(4, m.maxLength(4))
        .regex(/^\d+$/, m.invalidOtp),
      isRequired,
    ),

  // USER DETAILS
  firstName: (isRequired = true) =>
    optional(
      z
        .string()
        .trim()
        .min(2, m.minLength(2))
        .max(50, m.maxLength(50))
        .regex(NAME_REGEX, "First name can only contain letters"),
      isRequired,
    ),

  middleName: (isRequired = false) =>
    optional(
      z
        .string()
        .trim()
        .min(1, m.minLength(1))
        .max(50, m.maxLength(50))
        .regex(NAME_REGEX, "Middle name can only contain letters"),
      isRequired,
    ),

  lastName: (isRequired = true) =>
    optional(
      z
        .string()
        .trim()
        .min(2, m.minLength(2))
        .max(50, m.maxLength(50))
        .regex(NAME_REGEX, "Last name can only contain letters"),
      isRequired,
    ),

  phone: (isRequired = true) =>
    (isRequired
      ? z.string().trim().min(1, "This field is required")
      : z.string().trim().optional()
    ).superRefine((val, ctx) => {
      if (!val) return;

      // Remove symbols for deeper checks
      const digits = val.replace(/\D/g, "");

      // Must be 10 or 11 digits (if +1)
      if (!(digits.length === 10 || digits.length === 11)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be 10 digits",
        });
        return;
      }

      // If starts with +1 → remove it
      const clean =
        digits.length === 11 && digits.startsWith("1")
          ? digits.substring(1)
          : digits;

      const areaCode = clean.substring(0, 3);
      const exchangeCode = clean.substring(3, 6);

      // Area code rules
      if (Number(areaCode[0]) < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Area code must start with digits 2–9.",
        });
        return;
      }

      // Exchange code rules
      if (Number(exchangeCode[0]) < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "The first digit of the phone number after the area code must be 2–9.",
        });
        return;
      }

      // Final regex shape validation
      if (!US_PHONE_REGEX.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid phone format.",
        });
      }
    }),

  gender: (isRequired = false) =>
    optional(
      z.enum(["Male", "Female", "Other", "Prefer not to say"]),
      isRequired,
    ),

  dateOfBirth: (isRequired = false, minAge = 18) => {
    const validateAge = (value: string) => {
      const birthday = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthday.getFullYear();
      const monthDiff = today.getMonth() - birthday.getMonth();
      const dayDiff = today.getDate() - birthday.getDate();
      // Adjust if birthday hasn't occurred yet this year
      const realAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      return realAge >= minAge;
    };

    return isRequired
      ? z
          .string()
          .trim()
          .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), {
            message: "Date must be in YYYY-MM-DD format",
          })
          .refine((v) => !isNaN(new Date(v).getTime()), {
            message: "Invalid date",
          })
          .refine(validateAge, {
            message: `Must be at least ${minAge} years old`,
          })
      : z
          .string()
          .trim()
          .optional()
          .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
            message: "Date must be in YYYY-MM-DD format",
          })
          .refine((v) => !v || !isNaN(new Date(v).getTime()), {
            message: "Invalid date",
          })
          .refine((v) => !v || validateAge(v), {
            message: `Must be at least ${minAge} years old`,
          });
  },

  // JOB
  employeeId: (isRequired = true) =>
    optional(z.string().trim().max(50, m.maxLength(50)), isRequired),

  employmentType: (isRequired = true) =>
    optional(
      z.enum(["Full-Time", "Part-Time", "Contract", "Internship"]),
      isRequired,
    ),

  status: (isRequired = true) =>
    optional(z.enum(["Active", "On Leave", "Terminated"]), isRequired),

  salary: (isRequired = false) =>
    optional(z.number().positive(m.invalidSalary), isRequired),

  // ADDRESS
  country: (isRequired = true) => optional(z.string().trim(), isRequired),
  city: (isRequired = true) => optional(z.string().trim(), isRequired),
  address: (isRequired = false) => optional(z.string().trim(), isRequired),

  postalCode: (isRequired = false) =>
    optional(
      z
        .string()
        .trim()
        .regex(/^\d{4,10}$/, m.invalidPostalCode),
      isRequired,
    ),

  // FILES
  resume: (isRequired = true) =>
    optional(
      z.instanceof(File).refine((f) => f.size > 0, m.requiredFile),
      isRequired,
    ),

  profileImage: (isRequired = false) =>
    optional(
      z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), m.invalidFileType),
      isRequired,
    ),

  // ARRAYS
  skills: (isRequired = false) =>
    optional(z.array(z.string().trim()).min(1, m.requiredSkills), isRequired),

  languages: (isRequired = false) =>
    optional(
      z.array(
        z.object({
          language: z.string().trim(),
          proficiency: z.enum(["Basic", "Intermediate", "Advanced", "Native"]),
        }),
      ),
      isRequired,
    ),

  // TAX SPECIFIC VALIDATORS
  ssn: (isRequired = true) =>
    optional(
      z
        .string()
        .trim()
        .regex(/^\d{9}$/, "SSN must be exactly 9 digits"),
      isRequired,
    ),

  zipCode: (isRequired = false) =>
    optional(
      z
        .string()
        .trim()
        .min(1, "Zip code is required")
        .regex(/^\d{4,5}$/, "Zip code must be 4 or 5 digits"),
      isRequired,
    ),

  taxId: (isRequired = true) =>
    optional(
      z
        .number()
        .min(1, "Tax ID is required")
        .int("Tax ID must be a whole number"),
      isRequired,
    ),

  income: (isRequired = true) =>
    optional(
      z
        .number()
        .min(0, "Income cannot be negative")
        .max(999999999, "Income amount is too large"),
      isRequired,
    ),

  occupation: (isRequired = true) =>
    optional(
      z
        .string()
        .trim()
        .min(2, "Occupation must be at least 2 characters")
        .max(100, "Occupation is too long"),
      isRequired,
    ),
};
