import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Ad {
  id: string;
  name: string;
  status: "pending" | "approved" | "active" | "expired" | "paused" | "rejected";
  impressions: number;
  screens: number;
  createdAt: string;
}

interface AdsTableProps {
  ads: Ad[];
  title?: string;
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-warning/20 text-warning border-warning/30" },
  approved: { label: "Approved", className: "bg-success/20 text-success border-success/30" },
  active: { label: "Active", className: "bg-primary/20 text-primary border-primary/30" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground border-muted" },
  paused: { label: "Paused", className: "bg-secondary text-secondary-foreground border-secondary" },
  rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

const AdsTable = ({ ads, title = "Recent Ads" }: AdsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ad Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Impressions</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Screens</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id}>
                  <td className="p-4">
                    <span className="font-medium">{ad.name}</span>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant="outline" 
                      className={cn("font-medium", statusConfig[ad.status].className)}
                    >
                      {statusConfig[ad.status].label}
                    </Badge>
                  </td>
                  <td className="p-4 text-right font-mono">{ad.impressions.toLocaleString()}</td>
                  <td className="p-4 text-right">{ad.screens}</td>
                  <td className="p-4 text-right text-muted-foreground">{ad.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdsTable;
