import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
  href?: string;
}

const StatCard = ({ title, value, change, changeType = "neutral", icon: Icon, description, href }: StatCardProps) => {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      if (href.startsWith('#')) {
        return (
          <a href={href} className="block no-underline">
            {children}
          </a>
        );
      }
      return (
        <Link to={href} className="block no-underline">
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card variant="stat" className={cn("group h-full transition-all duration-300", href && "cursor-pointer active:scale-95")}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold font-display">{value}</p>
              {change && (
                <p className={cn(
                  "text-sm font-medium",
                  changeType === "positive" && "text-success",
                  changeType === "negative" && "text-destructive",
                  changeType === "neutral" && "text-muted-foreground"
                )}>
                  {change}
                </p>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};

export default StatCard;
