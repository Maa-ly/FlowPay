import Header from "@/components/layout/Header";
import CreateIntentForm from "@/components/create/CreateIntentForm";
import IntentTemplates, { IntentTemplate } from "@/components/create/IntentTemplates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Wrench } from "lucide-react";
import { useState } from "react";

const CreateIntent = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<IntentTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("templates");

  const handleTemplateSelect = (template: IntentTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("custom");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold mb-2">Create Payment Intent</h1>
          <p className="text-muted-foreground">Set up automated payments with intelligent constraints</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-0">
            <IntentTemplates onSelectTemplate={handleTemplateSelect} />
          </TabsContent>

          <TabsContent value="custom" className="mt-0">
            <CreateIntentForm selectedTemplate={selectedTemplate} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CreateIntent;
