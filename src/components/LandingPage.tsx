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
  Award,
  Leaf
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
      title: "Dual-Brain AI Engine",
      description: "Combines a Predictive Engine (forecasting delays & costs) with an Optimization Engine (finding the mathematically best plan) to eliminate under-utilized rakes and drastically cut demurrage costs."
    },
    {
      icon: BarChart3,
      title: "What-If Simulation",
      description: "Digital twin of your logistics network. Simulate disruptions like wagon shortages or siding closures to see AI's recommended pivot plan before a crisis hits, turning your team into proactive strategists."
    },
    {
      icon: Truck,
      title: "Dynamic Rail vs. Road Optimization",
      description: "Intelligently decides the best transport mode, automatically suggesting trucks for high-priority orders to meet critical deadlines, balancing cost against speed across your entire transport network."
    },
    {
      icon: Leaf,
      title: "Sustainability & ESG Reporting",
      description: "Tracks carbon footprint of every dispatch plan, favors fuller rakes and efficient routes, providing quantifiable data for sustainability reports and enhancing your ESG profile."
    },
    {
      icon: Target,
      title: "AI-Based Order Prioritization",
      description: "Advanced priority scoring considering customer importance, deadline urgency, and strategic value to ensure the most profitable orders are prioritized."
    },
    {
      icon: Eye,
      title: "Real-Time Tracking & Visibility",
      description: "Live GPS tracking with predictive ETA updates and automated exception alerts for proactive management across your entire logistics network."
    }
  ];

  const workflowSteps = [
    {
      step: "1",
      title: "Data Ingestion & Integration Layer",
      description: "Single source of truth pulling live data from ERP/SAP, inventory databases, and historical data lake. Stores all dispatch records, transit times, delays, and costs for AI learning."
    },
    {
      step: "2a", 
      title: "Predictive Engine (ML)",
      description: "Analyzes historical patterns using Scikit-learn/TensorFlow to predict delay costs, travel times (ETA), and demand forecasts - making the system more accurate over time."
    },
    {
      step: "2b",
      title: "Optimization Engine (Decision-Making)",
      description: "Uses Google OR-Tools to solve the core logistics puzzle: minimize total cost while obeying all business rules. Decides which orders go in which rake, from which stockyard, in what sequence."
    },
    {
      step: "3",
      title: "Application & Decision Support Layer", 
      description: "Backend API (Flask/FastAPI) exposes AI functionality. Business logic formats the optimal plan into actionable tables and summaries for planners."
    },
    {
      step: "4",
      title: "Presentation Layer & Execution",
      description: "React-based planner dashboard shows KPIs and generated plans. Real-time GPS/IoT tracks actual results, feeding back into the system for continuous AI improvement."
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
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
      >
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-steel flex items-center justify-center shadow-steel">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold bg-gradient-steel bg-clip-text text-transparent">
              SAIL Sahayak
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => scrollToSection('problem')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            >
              Problem
            </button>
            <button 
              onClick={() => scrollToSection('solution')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            >
              Solution
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            >
              Architecture
            </button>
            <button 
              onClick={() => scrollToSection('kpis')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            >
              Impact
            </button>
          </nav>
          <Button onClick={() => navigate('/dashboard')} variant="premium" size="lg">
            Live Demo <ArrowRight className="ml-2 w-5 h-5" />
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
          backgroundImage: `linear-gradient(135deg, rgba(28, 99, 181, 0.95) 0%, rgba(41, 98, 255, 0.85) 50%, rgba(88, 86, 214, 0.9) 100%), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto px-6 z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block mb-6"
          >
            <Badge className="text-base px-6 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 shadow-xl">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Innovation
            </Badge>
          </motion.div>

          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight"
          >
            SAIL Sahayak
            <br />
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Your AI Logistics Command Center
            </span>
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            An AI/ML-based Decision Support System that transforms complex, manual rake formation into a dynamic, optimized, and automated workflow. <span className="font-semibold">Smarter, faster, and more cost-effective.</span>
          </motion.p>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-white text-primary hover:bg-white/90 shadow-2xl hover:shadow-glow text-base px-10"
              variant="premium"
            >
              View Live Demo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="glass"
              onClick={() => scrollToSection('problem')}
              className="text-base px-10"
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: "98%", label: "Rake Utilization" },
              { value: "15%", label: "Cost Reduction" },
              { value: "95%", label: "On-Time Delivery" },
              { value: "-40%", label: "Demurrage Costs" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Problem Section */}
      <section id="problem" className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 text-base px-6 py-2 bg-destructive/10 text-destructive border-destructive/20">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Critical Challenges
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Current Logistics Pain Points</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              SAIL faces critical logistics challenges that impact efficiency, profitability, and customer satisfaction
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
              >
                <Card className="h-full group hover:border-destructive/20 bg-white">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/10 to-warning/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <card.icon className={`w-8 h-8 ${card.color}`} />
                    </div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
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
      <section id="solution" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(66,153,225,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 text-base px-6 py-2 bg-gradient-steel text-white border-0 shadow-steel">
              <Zap className="w-4 h-4 mr-2" />
              Key Innovations
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How We Deliver Value</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Four core innovations that transform logistics operations and drive measurable ROI
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full group hover:border-primary/30 bg-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="pb-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-steel flex items-center justify-center mb-4 shadow-steel group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base leading-relaxed">
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
      <section id="how-it-works" className="py-24 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(66,153,225,0.08),transparent_60%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 text-base px-6 py-2 bg-accent/50 text-accent-foreground border-primary/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              System Architecture
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Clear, unidirectional data flow from raw data to optimized action with continuous learning feedback loop
            </p>
          </motion.div>
          <div className="max-w-5xl mx-auto">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex items-start mb-10 last:mb-0 group"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-steel rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-8 shadow-steel group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                  {step.step}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* KPIs Section */}
      <section id="kpis" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(66,153,225,0.1),transparent_70%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-6 text-base px-6 py-2 bg-success/10 text-success border-success/20">
              <CheckCircle className="w-4 h-4 mr-2" />
              Proven Results
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Measurable Impact</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Real performance improvements across key logistics metrics
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {kpis.map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15, type: "spring" }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-8 group hover:border-primary/30 bg-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-steel flex items-center justify-center mx-auto mb-6 shadow-steel group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                      <kpi.icon className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.15 }}
                      viewport={{ once: true }}
                      className="text-5xl font-extrabold bg-gradient-steel bg-clip-text text-transparent mb-3"
                    >
                      {kpi.value}
                    </motion.div>
                    <div className="text-base font-semibold text-foreground">
                      {kpi.label}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold">SAIL Sahayak</div>
            </div>
            <p className="text-lg mb-8 opacity-90 max-w-md">
              AI-Powered Logistics Command Center
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
              <div className="text-sm opacity-80">Team: SAIL Innovation Labs</div>
              <Button variant="glass" size="sm" className="shadow-lg">
                View Documentation
              </Button>
            </div>
            <div className="text-xs opacity-70 mt-4">
              © 2024 SAIL Sahayak. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;