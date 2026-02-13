import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CustomAvatarProps {
  name?: string;
  image?: string | null;
  className?: string;
}

export function CustomAvatar({ name, image, className }: CustomAvatarProps) {
  const fallbackLetter = name?.trim()?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <Avatar className={cn(className)}>
      {image ? (
        <AvatarImage src={image} alt={name ?? "avatar"} />
      ) : (
        <AvatarImage src="" alt="no-image" className="hidden" />
      )}
      <AvatarFallback>{fallbackLetter}</AvatarFallback>
    </Avatar>
  );
}
