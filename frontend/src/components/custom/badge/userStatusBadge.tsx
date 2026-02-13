import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  AlertCircleIcon,
  UserCheckIcon,
  UserXIcon,
  ShieldIcon,
  ClockIcon,
  BanIcon,
} from "lucide-react";

// Main user status badge
export const getUserStatusBadge = (status: string) => {
  const statusConfig = {
    active: {
      label: "Active",
      variant: "default" as const,
      icon: CheckIcon,
      className: "bg-green-500 text-white dark:bg-green-600",
    },
    suspended: {
      label: "Suspended",
      variant: "secondary" as const,
      icon: BanIcon,
      className: "bg-yellow-500 text-white dark:bg-yellow-600",
    },
    deleted: {
      label: "Deleted",
      variant: "destructive" as const,
      icon: UserXIcon,
      className: "bg-red-500 text-white dark:bg-red-600",
    },
    pending: {
      label: "Pending",
      variant: "secondary" as const,
      icon: ClockIcon,
      className: "bg-blue-500 text-white dark:bg-blue-600",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: "secondary" as const,
    icon: AlertCircleIcon,
    className: "bg-gray-500 text-white dark:bg-gray-600",
  };

  const IconComponent = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 text-xs ${config.className}`}
    >
      <IconComponent size={10} />
      {config.label}
    </Badge>
  );
};

// Verification status badge
export const getVerificationBadge = (isVerified: boolean) => {
  if (isVerified) {
    return (
      <Badge
        variant="secondary"
        className="flex items-center gap-1 bg-green-500 text-white dark:bg-green-600 text-xs"
      >
        <UserCheckIcon size={10} />
        Verified
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 bg-yellow-500 text-white dark:bg-yellow-600 text-xs"
    >
      <ClockIcon size={10} />
      Unverified
    </Badge>
  );
};

// OTP verification badge
export const getOtpVerificationBadge = (otpVerified: boolean) => {
  if (otpVerified) {
    return (
      <Badge
        variant="secondary"
        className="flex items-center gap-1 bg-blue-500 text-white dark:bg-blue-600 text-xs"
      >
        <CheckIcon size={10} />
        OTP Verified
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 bg-gray-500 text-white dark:bg-gray-600 text-xs"
    >
      <AlertCircleIcon size={10} />
      OTP Pending
    </Badge>
  );
};

// Profile completion badge
export const getProfileCompletionBadge = (completionStatus: string) => {
  const statusConfig = {
    complete: {
      label: "Complete",
      className: "bg-green-500 text-white dark:bg-green-600",
    },
    incomplete: {
      label: "Incomplete",
      className: "bg-yellow-500 text-white dark:bg-yellow-600",
    },
    pending: {
      label: "Pending",
      className: "bg-blue-500 text-white dark:bg-blue-600",
    },
  };

  const config = statusConfig[
    completionStatus as keyof typeof statusConfig
  ] || {
    label: completionStatus,
    className: "bg-gray-500 text-white dark:bg-gray-600",
  };

  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1 text-xs ${config.className}`}
    >
      {config.label}
    </Badge>
  );
};

// Role badge
export const getRoleBadge = (roleName: string) => {
  const roleConfig = {
    admin: {
      className: "bg-purple-500 text-white dark:bg-purple-600",
    },
    moderator: {
      className: "bg-blue-500 text-white dark:bg-blue-600",
    },
    user: {
      className: "bg-green-500 text-white dark:bg-green-600",
    },
    guest: {
      className: "bg-gray-500 text-white dark:bg-gray-600",
    },
  };

  const config = roleConfig[
    roleName.toLowerCase() as keyof typeof roleConfig
  ] || {
    className: "bg-gray-500 text-white dark:bg-gray-600",
  };

  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1 text-xs ${config.className}`}
    >
      <ShieldIcon size={10} />
      {roleName}
    </Badge>
  );
};

// Combined status badge (shows multiple statuses)
export const getCombinedUserBadge = (user: {
  status: string;
  is_verified: boolean;
  otp_verified: boolean;
}) => {
  const { status, is_verified, otp_verified } = user;

  if (status !== "active") {
    return getUserStatusBadge(status);
  }

  if (!is_verified) {
    return getVerificationBadge(false);
  }

  if (!otp_verified) {
    return getOtpVerificationBadge(false);
  }

  return getUserStatusBadge("active");
};
