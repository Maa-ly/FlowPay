import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import Header from "@/components/layout/Header";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center max-w-2xl mx-auto animate-fade-in">
            {/* 404 Number */}
            <div className="relative mb-8">
              <h1 className="font-display text-9xl md:text-[12rem] font-bold gradient-text opacity-20">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-24 h-24 text-primary animate-pulse" />
              </div>
            </div>

            {/* Error Message */}
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to a new location.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="gradient" 
                size="lg"
                onClick={() => navigate('/')}
                className="hover:scale-105 transition-transform w-full sm:w-auto"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate(-1)}
                className="hover:scale-105 transition-transform w-full sm:w-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </Button>
            </div>

            {/* Suggested Path */}
            <div className="mt-12 p-6 rounded-xl glass border border-border/50">
              <p className="text-sm text-muted-foreground mb-3">
                Tried to access: <span className="font-mono text-foreground">{location.pathname}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Looking for something? Try the <a href="/" className="text-primary hover:underline">home page</a> or <a href="/dashboard" className="text-primary hover:underline">dashboard</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
