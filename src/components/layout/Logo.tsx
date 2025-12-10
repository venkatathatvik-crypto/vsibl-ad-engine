import { cn } from "@/lib/utils";
import vsiblLogo from "@/assets/vsibl-logo-transparent.png";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

const Logo = ({ className, showTagline = false, size = "md" }: LogoProps) => {
  const imageSizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
    xl: "h-24",
    "2xl": "h-40",
    "3xl": "h-64",
    "4xl": "h-96",
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
