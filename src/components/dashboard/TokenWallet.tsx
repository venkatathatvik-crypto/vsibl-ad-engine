import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

interface TokenWalletProps {
  available: number;
  used: number;
  total: number;
}

const TokenWallet = ({ available, used, total }: TokenWalletProps) => {
  const usagePercent = total > 0 ? (used / total) * 100 : 0;

  return (
    <Card variant="glow" className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Token Wallet
          </CardTitle>
          <Button variant="hero" size="sm" asChild>
            <Link to="/dashboard/tokens">
              <Coins className="w-4 h-4 mr-1" />
              Buy Tokens
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Available Tokens */}
          <div className="text-center p-6 bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
            <p className="text-5xl font-bold font-display text-foreground">
              {available.toLocaleString()}
            </p>
            <p className="text-sm text-primary mt-2">VSIBL Tokens</p>
          </div>

          {/* Usage Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Usage</span>
              <span className="font-medium">{used.toLocaleString()} / {total.toLocaleString()}</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Used Today</span>
              </div>
              <p className="text-xl font-semibold">156</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Coins className="w-4 h-4" />
                <span className="text-xs">Rate/Min</span>
              </div>
              <p className="text-xl font-semibold">0.5</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenWallet;
