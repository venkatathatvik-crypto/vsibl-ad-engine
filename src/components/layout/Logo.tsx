import { cn } from "@/lib/utils";
import vsiblLogo from "@/assets/vsibl-logo-transparent.png";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, showTagline = false, size = "md" }: LogoProps) => {
  const imageSizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
  };

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <img
        src={vsiblLogo}
        alt="VSIBL"
        className={cn("object-contain", imageSizes[size])}
      />
    </div>
  );
};

export default Logo;
