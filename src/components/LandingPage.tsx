import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">SAIL Sahayak</h1>
      <p className="text-xl mb-8">AI-Powered Logistics Control Tower</p>
      <Button onClick={() => navigate('/dashboard')} size="lg">
        Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
};

export default LandingPage;