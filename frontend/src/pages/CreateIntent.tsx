import Header from "@/components/layout/Header";
import CreateIntentForm from "@/components/create/CreateIntentForm";

const CreateIntent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold mb-2">Create Payment Intent</h1>
          <p className="text-muted-foreground">Set up automated payments with intelligent constraints</p>
        </div>

        <CreateIntentForm />
      </main>
    </div>
  );
};

export default CreateIntent;
