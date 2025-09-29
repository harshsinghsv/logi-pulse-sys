import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  Play, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BarChart3
} from "lucide-react";

interface Simulation {
  scenario_name: string;
  description: string;
  before_kpis: {
    cost: number;
    utilization: number;
    on_time: number;
    delivery_time: number;
  };
  after_kpis: {
    cost: number;
    utilization: number;
    on_time: number;
    delivery_time: number;
  };
  recommendations: string[];
}

const Simulations = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [currentSimulation, setCurrentSimulation] = useState<Simulation | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await fetch('/src/data/simulations.json');
        const data = await response.json();
        setSimulations(data);
      } catch (error) {
        console.error('Error fetching simulations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulations();
  }, []);

  const handleRunSimulation = () => {
    if (!selectedScenario) {
      toast({
        title: "No Scenario Selected",
        description: "Please select a scenario to run the simulation.",
        variant: "destructive"
      });
      return;
    }

    const scenario = simulations.find(s => s.scenario_name === selectedScenario);
    if (!scenario) return;

    setIsRunning(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setCurrentSimulation(scenario);
      setIsRunning(false);
      toast({
        title: "Simulation Complete",
        description: `What-if analysis for "${scenario.scenario_name}" has been completed.`,
      });
    }, 3000);
  };

  const getMetricChange = (before: number, after: number, isPercentage = false) => {
    const change = ((after - before) / before) * 100;
    const isPositive = change > 0;
    const displayValue = isPercentage 
      ? `${Math.abs(change).toFixed(1)}%` 
      : `${Math.abs(change).toFixed(0)}%`;
    
    return {
      change: change,
      displayValue,
      isPositive,
      color: isPositive ? "text-success" : "text-destructive",
      icon: isPositive ? TrendingUp : TrendingDown
    };
  };

  const getImprovementColor = (before: number, after: number, higherIsBetter = true) => {
    const isImproved = higherIsBetter ? after > before : after < before;
    return isImproved ? "text-success" : "text-destructive";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">What-If Scenario Simulator</h2>
        <p className="text-muted-foreground">
          Test different scenarios and see how RakeOptima adapts to optimize your logistics
        </p>
      </div>

      {/* Simulation Controls */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Simulation Controls
          </CardTitle>
          <CardDescription>
            Select a scenario to see how our AI optimizes under different conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a scenario..." />
              </SelectTrigger>
              <SelectContent>
                {simulations.map((sim) => (
                  <SelectItem key={sim.scenario_name} value={sim.scenario_name}>
                    {sim.scenario_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleRunSimulation}
              disabled={!selectedScenario || isRunning}
              className="shadow-steel"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setCurrentSimulation(null)}>
              Clear Results
            </Button>
          </div>
          
          {selectedScenario && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Scenario Description</h4>
              <p className="text-sm text-muted-foreground">
                {simulations.find(s => s.scenario_name === selectedScenario)?.description}
              </p>
            </div>
          )}

          {isRunning && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                <span className="font-medium text-primary">AI Processing Scenario...</span>
              </div>
              <Progress value={66} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Analyzing constraints and generating optimal solutions...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {currentSimulation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Scenario Header */}
          <Card className="shadow-card border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Simulation Results: {currentSimulation.scenario_name}
                  </CardTitle>
                  <CardDescription>{currentSimulation.description}</CardDescription>
                </div>
                <Badge className="bg-success/20 text-success-foreground">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Before vs After Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Before Optimization */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                  <AlertTriangle className="w-5 h-5" />
                  Before Optimization
                </CardTitle>
                <CardDescription>Performance without RakeOptima</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Cost</span>
                    </div>
                    <span className="text-lg font-bold">
                      ₹{(currentSimulation.before_kpis.cost / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Utilization</span>
                    </div>
                    <span className="text-lg font-bold">{currentSimulation.before_kpis.utilization}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">On-Time Delivery</span>
                    </div>
                    <span className="text-lg font-bold">{currentSimulation.before_kpis.on_time}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Avg. Delivery Time</span>
                    </div>
                    <span className="text-lg font-bold">{currentSimulation.before_kpis.delivery_time}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* After Optimization */}
            <Card className="shadow-card border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  After RakeOptima
                </CardTitle>
                <CardDescription>Performance with AI optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium">Total Cost</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">
                        ₹{(currentSimulation.after_kpis.cost / 100000).toFixed(1)}L
                      </div>
                      {(() => {
                        const change = getMetricChange(currentSimulation.before_kpis.cost, currentSimulation.after_kpis.cost);
                        return (
                          <div className={`text-xs flex items-center ${change.color}`}>
                            <change.icon className="w-3 h-3 mr-1" />
                            {change.displayValue}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium">Utilization</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">
                        {currentSimulation.after_kpis.utilization}%
                      </div>
                      {(() => {
                        const change = getMetricChange(currentSimulation.before_kpis.utilization, currentSimulation.after_kpis.utilization, true);
                        return (
                          <div className="text-xs flex items-center text-success">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{change.displayValue}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium">On-Time Delivery</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">
                        {currentSimulation.after_kpis.on_time}%
                      </div>
                      {(() => {
                        const change = getMetricChange(currentSimulation.before_kpis.on_time, currentSimulation.after_kpis.on_time, true);
                        return (
                          <div className="text-xs flex items-center text-success">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{change.displayValue}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium">Avg. Delivery Time</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">
                        {currentSimulation.after_kpis.delivery_time}h
                      </div>
                      {(() => {
                        const change = getMetricChange(currentSimulation.before_kpis.delivery_time, currentSimulation.after_kpis.delivery_time);
                        return (
                          <div className="text-xs flex items-center text-success">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            -{change.displayValue}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Intelligent suggestions to optimize performance in this scenario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentSimulation.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Simulations;