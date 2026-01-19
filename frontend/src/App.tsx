import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { wagmiConfig } from "./config/wagmi";
import { TelegramProvider } from "./contexts/TelegramContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateIntent from "./pages/CreateIntent";
import IntentDetails from "./pages/IntentDetails";
import NotFound from "./pages/NotFound";

// Import RainbowKit styles
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={lightTheme({
          accentColor: 'hsl(152, 76%, 42%)', // FlowPay primary green
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
        })}
      >
        <TelegramProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create" element={<CreateIntent />} />
                <Route path="/intent/:id" element={<IntentDetails />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TelegramProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
