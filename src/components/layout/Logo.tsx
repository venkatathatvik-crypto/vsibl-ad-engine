import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, showTagline = false, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const taglineSizes = {
    sm: "text-[8px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <div className="flex items-center gap-1">
        {/* Pixel Grid Icon */}
        <div className={cn("grid grid-cols-2 gap-0.5", size === "lg" ? "gap-1" : "gap-0.5")}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "bg-foreground rounded-sm",
                size === "sm" && "w-2 h-2",
                size === "md" && "w-2.5 h-2.5",
                size === "lg" && "w-3 h-3"
              )}
            />
          ))}
        </div>
        <span className={cn("font-display font-bold tracking-tight", sizeClasses[size])}>
          VSIBL
        </span>
      </div>
      {showTagline && (
        <span className={cn("text-muted-foreground font-medium tracking-[0.2em] uppercase mt-1", taglineSizes[size])}>
          BOLD. URBAN. INTERACTIVE.
        </span>
      )}
    </div>
  );
};

export default Logo;
