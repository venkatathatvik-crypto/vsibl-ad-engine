import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Battery, Clock, Tv } from "lucide-react";

interface LiveMapProps {
  className?: string;
}

const LiveMap = ({ className }: LiveMapProps) => {
  // Mock screen data
  const screens = [
    { id: 1, lat: 13.0418, lng: 80.2850, battery: 85, lastSeen: "2 min ago", ad: "Pongal Special" },
    { id: 2, lat: 13.0405, lng: 80.2337, battery: 72, lastSeen: "5 min ago", ad: "Chennai Silks" },
    { id: 3, lat: 12.9171, lng: 80.2279, battery: 91, lastSeen: "1 min ago", ad: "Sathyam Cinemas" },
    { id: 4, lat: 13.0102, lng: 80.2156, battery: 45, lastSeen: "8 min ago", ad: "Phoenix Promo" },
    { id: 5, lat: 13.0827, lng: 80.2707, battery: 68, lastSeen: "3 min ago", ad: "Metro Launch" },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Live Screen Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary/50 border border-border">
          {/* Dark Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background">
            {/* Grid overlay */}
            <div className="absolute inset-0 pixel-grid opacity-30" />

            {/* City streets simulation */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 225">
              {/* Main roads */}
              <path d="M0 112.5 L400 112.5" stroke="hsl(300 6% 25%)" strokeWidth="3" fill="none" />
              <path d="M200 0 L200 225" stroke="hsl(300 6% 25%)" strokeWidth="3" fill="none" />
              <path d="M0 56.25 L400 56.25" stroke="hsl(300 6% 20%)" strokeWidth="1.5" fill="none" />
              <path d="M0 168.75 L400 168.75" stroke="hsl(300 6% 20%)" strokeWidth="1.5" fill="none" />
              <path d="M100 0 L100 225" stroke="hsl(300 6% 20%)" strokeWidth="1.5" fill="none" />
              <path d="M300 0 L300 225" stroke="hsl(300 6% 20%)" strokeWidth="1.5" fill="none" />
            </svg>

            {/* Screen markers */}
            {screens.map((screen, i) => (
              <div
                key={screen.id}
                className="absolute group cursor-pointer"
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${25 + ((i % 3) * 25)}%`,
                }}
              >
                {/* Pulse effect */}
                <div className="absolute inset-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 animate-ping" />

                {/* Marker */}
                <div className="relative w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary border-2 border-foreground shadow-glow" />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-card border border-border rounded-lg p-3 shadow-xl min-w-[160px]">
                    <p className="font-medium text-sm mb-2">Screen #{screen.id}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Battery className="w-3 h-3" />
                        <span>{screen.battery}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{screen.lastSeen}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tv className="w-3 h-3" />
                        <span>{screen.ad}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Active Screen</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{screens.length} online</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveMap;
