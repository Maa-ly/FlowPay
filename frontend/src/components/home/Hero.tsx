import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Wavy Background SVG */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(152 76% 42% / 0.3)" />
              <stop offset="50%" stopColor="hsl(165 70% 38% / 0.2)" />
              <stop offset="100%" stopColor="hsl(120 60% 45% / 0.1)" />
            </linearGradient>
            <linearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(165 70% 45% / 0.25)" />
              <stop offset="100%" stopColor="hsl(152 76% 42% / 0.15)" />
            </linearGradient>
            <linearGradient id="wave3" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="hsl(120 60% 50% / 0.2)" />
              <stop offset="100%" stopColor="hsl(152 76% 48% / 0.3)" />
            </linearGradient>
          </defs>
          
          {/* First flowing wave */}
          <path
            className="animate-wave-slow"
            fill="url(#wave1)"
            d="M0,300 C150,200 350,400 500,350 C650,300 750,150 900,200 C1050,250 1200,400 1350,300 C1400,270 1420,280 1440,290 L1440,0 L0,0 Z"
          />
          
          {/* Second flowing wave */}
          <path
            className="animate-wave-medium"
            fill="url(#wave2)"
            d="M0,500 C200,400 300,600 500,550 C700,500 800,350 1000,400 C1200,450 1300,550 1440,500 L1440,200 C1300,300 1200,200 1000,250 C800,300 700,450 500,400 C300,350 200,250 0,350 Z"
          />
          
          {/* Third flowing wave */}
          <path
            className="animate-wave-fast"
            fill="url(#wave3)"
            d="M0,700 C100,650 200,750 350,700 C500,650 600,550 800,600 C1000,650 1100,750 1250,700 C1350,665 1400,680 1440,670 L1440,900 L0,900 Z"
          />
          
          {/* Accent snake curve */}
          <path
            className="animate-snake"
            fill="none"
            stroke="url(#wave1)"
            strokeWidth="3"
            strokeLinecap="round"
            d="M-50,450 Q150,350 300,450 T600,450 T900,450 T1200,450 T1500,450"
          />
        </svg>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 animate-fade-in hover:scale-105 transition-transform cursor-default">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground/80 flex items-center gap-1.5">
              Powered by <img src="/cronos-icon.png" alt="Cronos" className="h-4 w-16 inline-block" /> x402
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Intent-Driven
            <br />
            <span className="gradient-text">Agentic Payments</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Express your financial intentions once. Let intelligent agents handle the rest with adaptive, secure on-chain automation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/dashboard">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto hover:scale-105 transition-transform">
                Launch App
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="glass" size="xl" className="w-full sm:w-auto text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10 hover:scale-105 transition-transform">
                Create Intent
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <FeatureCard
              icon={<Bot className="w-6 h-6" />}
              title="Agentic Automation"
              description="AI-driven agents evaluate your constraints before executing payments"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Safety Buffers"
              description="Set minimum balance thresholds to protect your funds"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="x402 Settlement"
              description="Seamless programmatic payments on Cronos EVM"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="glass rounded-2xl p-6 border border-primary-foreground/10 hover:border-primary/30 transition-all duration-300 group hover:scale-105 hover:-translate-y-1 text-center">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform mx-auto">
      {icon}
    </div>
    <h3 className="font-display font-semibold text-lg text-primary-foreground mb-2">{title}</h3>
    <p className="text-sm text-primary-foreground/60">{description}</p>
  </div>
);

export default Hero;
