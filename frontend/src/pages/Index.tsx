import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Twitter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const Index = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isConnected) {
      navigate("/create");
    } else if (openConnectModal) {
      openConnectModal();
    }
  };
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="gradient-text">Automate</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Start creating intent-driven payments today and let intelligent agents handle your recurring transactions.
          </p>
          <Button 
            variant="gradient" 
            size="xl" 
            className="hover:scale-105 transition-transform"
            onClick={handleGetStarted}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
              src="/flowpay-icon.svg" 
              alt="FlowPay" 
              className="w-8 h-8 transition-transform group-hover:scale-110"
            />
            <span className="font-display font-bold text-xl">
              Flow<span className="text-[hsl(142,60%,35%)]">PAY</span>
            </span>
          </Link>
            
            <p className="text-sm text-muted-foreground">
              Built on Cronos EVM with x402 Programmatic Payments
            </p>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
