import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isConnected } = useAccount();

  // Only show navigation links when wallet is connected
  const navLinks = isConnected ? [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create", label: "Create Intent" },
  ] : [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors relative group ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
                {/* Active indicator */}
                {isActive(link.href) && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
                {/* Hover indicator */}
                {!isActive(link.href) && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform" />
                )}
              </Link>
            ))}
          </nav>

          {/* Wallet Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isConnected && <NotificationCenter />}
            <ConnectButton 
              chainStatus="icon"
              showBalance={true}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    isActive(link.href)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                  )}
                </Link>
              ))}
              
              {/* Mobile Wallet Section */}
              <div className="mt-2 px-4">
                <ConnectButton 
                  chainStatus="icon"
                  showBalance={true}
                  accountStatus="full"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
