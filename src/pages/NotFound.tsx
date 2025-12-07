import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 pixel-grid opacity-10" />
      </div>

      <div className="text-center relative z-10">
        <Link to="/" className="inline-block mb-8">
          <Logo size="lg" />
        </Link>
        
        <h1 className="text-8xl font-bold font-display text-primary mb-4">404</h1>
        <p className="text-xl font-medium mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button variant="hero" asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
