import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Box, 
  AlertTriangle, 
  Target,
  Brain,
  MapPin,
  Truck,
  BarChart3,
  Eye,
  Zap,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Timer,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const problemCards = [
    {
      icon: Clock,
      title: "Manual Delays",
      description: "Current manual coordination leads to slow rake formation and missed deadlines.",
      color: "text-warning"
    },
    {
      icon: Box,
      title: "Underutilized Rakes",
      description: "Inefficient order clubbing results in partially loaded wagons, increasing per-ton costs.",
      color: "text-destructive"
    },
    {
      icon: DollarSign,
      title: "Costly Penalties",
      description: "Demurrage and idle freight charges accumulate due to planning gaps.",
      color: "text-warning"
    },
    {
      icon: Target,
      title: "Priority Conflicts",
      description: "Struggles in balancing high-priority government orders with commercial customer needs.",
      color: "text-muted-foreground"
    }
  ];

  const solutionFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Rake Formation",
      description: "Smartly clubs orders to maximize wagon space utilization up to 98%."
    },
    {
      icon: MapPin,
      title: "Stockyard & Loading Point Optimization",
      description: "Dynamically selects the most cost-effective stockyard and loading point."
    },
    {
      icon: Truck,
      title: "Dynamic Mode Selection (Rail vs. Road)",
      description: "Automatically suggests truck transport for small, urgent orders to avoid rake delays."
    },
    {
      icon: Target,
      title: "AI-Based Order Prioritization",
      description: "Ensures high-priority orders are dispatched first to meet critical SLAs."
    },
    {
      icon: Eye,
      title: "Real-Time Tracking & Visibility",
      description: "A unified dashboard view of all assets in transit."
    },
    {
      icon: Zap,
      title: "Unique Differentiators",
      description: "What-if Simulation, Carbon Footprint Tracking, and Predictive Delay Alerts."
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Data Ingest",
      description: "System aggregates data on orders, inventory, and wagons."
    },
    {
      step: "2", 
      title: "AI Optimizer",
      description: "Our core engine processes constraints and finds the optimal plan."
    },
    {
      step: "3",
      title: "Daily Plan Generation",
      description: "The system outputs a clear, actionable dispatch schedule."
    },
    {
      step: "4",
      title: "Simulation & Validation", 
      description: "Planners can run what-if scenarios to test resilience."
    },
    {
      step: "5",
      title: "Dashboard Visualization",
      description: "All insights are displayed on an easy-to-use dashboard."
    }
  ];

  const kpis = [
    { value: "98%", label: "Rake Utilization", icon: TrendingUp },
    { value: "15%", label: "Logistics Cost Reduction", icon: DollarSign },
    { value: "95%", label: "On-Time Delivery", icon: Timer },
    { value: "-40%", label: "Demurrage Costs", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-steel bg-clip-text text-transparent">
            RakeOptima
          </div>
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => scrollToSection('problem')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Problem
            </button>
            <button 
              onClick={() => scrollToSection('solution')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Solution
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('kpis')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              KPIs
            </button>
          </nav>
          <Button onClick={() => navigate('/dashboard')} className="shadow-steel">
            Live Demo <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(33, 102, 172, 0.8), rgba(33, 102, 172, 0.6)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 z-10">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            AI-Powered Rake Formation Optimization for SAIL
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-gray-100 max-w-4xl mx-auto"
          >
            Smarter logistics, lower costs, and on-time deliveries powered by our intelligent Decision Support System.
          </motion.p>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-x-4"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-white text-primary hover:bg-gray-100 shadow-glow"
            >
              View Demo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection('problem')}
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Current Challenges</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SAIL faces critical logistics challenges that impact efficiency and profitability
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problemCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full shadow-card hover:shadow-steel transition-shadow">
                  <CardHeader>
                    <card.icon className={`w-12 h-12 ${card.color} mb-4`} />
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-lg px-6 py-2 bg-primary text-primary-foreground">
              🚀 Proposed Solution
            </Badge>
            <h2 className="text-4xl font-bold mb-4">RakeOptima Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive AI-driven optimization for every aspect of your logistics operations
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutionFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full shadow-card hover:shadow-steel transition-all duration-300">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Five simple steps to optimize your entire logistics workflow
            </p>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-start mb-12 last:mb-0"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-steel rounded-full flex items-center justify-center text-white font-bold text-lg mr-6 shadow-steel">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-lg text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* KPIs Section */}
      <section id="kpis" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Proven Impact</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Measurable improvements in key performance indicators
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-8 shadow-card hover:shadow-steel transition-shadow">
                  <kpi.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-primary mb-2"
                  >
                    {kpi.value}
                  </motion.div>
                  <div className="text-lg font-medium text-muted-foreground">
                    {kpi.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">RakeOptima</div>
          <p className="text-lg mb-6">Built for SAIL Hackathon 2024</p>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-sm opacity-80">Team: AI Logistics Solutions</div>
            <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-primary">
              GitHub Repository
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;