import { FileText, Bot, CheckCircle2, Send } from "lucide-react";

const steps = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Define Intent",
    description: "Create a payment intent with recipient, amount, frequency, and safety constraints",
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "Agent Monitors",
    description: "Our intelligent agent continuously evaluates your wallet state and conditions",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "Decision Phase",
    description: "Agent approves or delays execution based on your defined constraints",
  },
  {
    icon: <Send className="w-6 h-6" />,
    title: "Settlement",
    description: "Approved payments execute automatically via x402 on Cronos EVM",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From intent to execution in four simple steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50" />
                )}
                
                <div className="relative flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div className="w-16 h-16 rounded-2xl bg-card shadow-card flex items-center justify-center mb-4 text-primary border border-border">
                    {step.icon}
                  </div>
                  
                  <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;