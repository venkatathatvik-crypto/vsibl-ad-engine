import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  
  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/admin" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isOpen ? "max-h-64 mt-4" : "max-h-0"
        )}>
          <div className="flex flex-col gap-4 py-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
            <div className="flex gap-3 pt-4 border-t border-border/50">
              <Button variant="ghost" asChild className="flex-1">
                <Link to="/login" onClick={() => setIsOpen(false)}>Log In</Link>
              </Button>
              <Button variant="hero" asChild className="flex-1">
                <Link to="/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
