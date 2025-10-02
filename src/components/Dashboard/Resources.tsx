import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Warehouse, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Wrench,
  Train,
  Zap
} from "lucide-react";

interface Stockyard {
  id: string;
  name: string;
  status: string;
  capacity_percent: number;
  available_tonnage: number;
  rakes_loading: number;
  location: string;
  ai_suggestion: string;
}

interface WagonType {
  type: string;
  total: number;
  available: number;
  maintenance: number;
  in_use: number;
}

interface LoadingPoint {
  id: string;
  status: string;
  current_rake: string | null;
  estimated_free: string | null;
}

interface ResourcesData {
  wagons: WagonType[];
  loading_points: LoadingPoint[];
}

const Resources = () => {
  const [stockyards, setStockyards] = useState<Stockyard[]>([]);
  const [resources, setResources] = useState<ResourcesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stockyardsModule, resourcesModule] = await Promise.all([
          import('@/data/stockyards.json'),
          import('@/data/resources.json')
        ]);
        const stockyardsData = stockyardsModule.default as Stockyard[];
        const resourcesData = resourcesModule.default as ResourcesData;
        setStockyards(stockyardsData);
        setResources(resourcesData);
      } catch (error) {
        console.error('Error loading resources data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Optimal": { 
        variant: "default" as const, 
        className: "bg-success/20 text-success-foreground",
        icon: CheckCircle 
      },
      "Busy": { 
        variant: "secondary" as const, 
        className: "bg-warning/20 text-warning-foreground",
        icon: Clock 
      },
      "At Capacity": { 
        variant: "destructive" as const, 
        className: "bg-destructive/20 text-destructive-foreground",
        icon: AlertTriangle 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "secondary" as const,
      className: "",
      icon: CheckCircle
    };
    
    return (
      <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
        <config.icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getLoadingPointStatus = (status: string) => {
    const statusConfig = {
      "Available": { 
        variant: "default" as const, 
        className: "bg-success/20 text-success-foreground",
        icon: CheckCircle 
      },
      "Busy": { 
        variant: "secondary" as const, 
        className: "bg-warning/20 text-warning-foreground",
        icon: Train 
      },
      "Maintenance": { 
        variant: "outline" as const, 
        className: "bg-muted",
        icon: Wrench 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "secondary" as const,
      className: "",
      icon: CheckCircle
    };
    
    return (
      <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
        <config.icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
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
        <h2 className="text-2xl font-semibold mb-2">Stockyard & Resources</h2>
        <p className="text-muted-foreground">
          Monitor stockyard capacity, wagon availability, and loading point status
        </p>
      </div>

      {/* Stockyard Optimization View */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Warehouse className="w-5 h-5" />
          Stockyard Status & AI Optimization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {stockyards.map((stockyard, index) => (
            <motion.div
              key={stockyard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="shadow-card hover:shadow-steel transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{stockyard.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {stockyard.location}
                      </CardDescription>
                    </div>
                    {getStatusBadge(stockyard.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Capacity Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capacity Utilization</span>
                      <span className="font-medium">{stockyard.capacity_percent}%</span>
                    </div>
                    <Progress 
                      value={stockyard.capacity_percent} 
                      className="h-2"
                    />
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stockyard.available_tonnage.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Available Tonnage</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stockyard.rakes_loading}
                      </div>
                      <div className="text-xs text-muted-foreground">Rakes Loading</div>
                    </div>
                  </div>

                  {/* AI Suggestion */}
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-primary mb-1">AI Suggestion</div>
                        <div className="text-sm text-foreground">{stockyard.ai_suggestion}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wagon Availability Section */}
      {resources && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wagon Types */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Wagon Availability
                </CardTitle>
                <CardDescription>Current wagon inventory and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resources.wagons.map((wagon) => {
                    const utilizationPercent = (wagon.in_use / wagon.total) * 100;
                    const availablePercent = (wagon.available / wagon.total) * 100;
                    
                    return (
                      <div key={wagon.type} className="p-4 border border-border rounded-lg bg-muted/10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{wagon.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {wagon.total} total wagons
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-success/20 text-success-foreground">
                            {wagon.available} Available
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Available ({wagon.available})</span>
                            <span>In Use ({wagon.in_use})</span>
                            <span>Maintenance ({wagon.maintenance})</span>
                          </div>
                          <div className="flex h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="bg-success" 
                              style={{ width: `${availablePercent}%` }}
                            ></div>
                            <div 
                              className="bg-primary" 
                              style={{ width: `${utilizationPercent}%` }}
                            ></div>
                            <div 
                              className="bg-warning" 
                              style={{ width: `${(wagon.maintenance / wagon.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading Points */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Train className="w-5 h-5" />
                  Loading Point Schedule
                </CardTitle>
                <CardDescription>Real-time loading point availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.loading_points.map((point) => (
                    <div 
                      key={point.id} 
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {point.id.split('-')[1]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{point.id}</p>
                          {point.current_rake && (
                            <p className="text-sm text-muted-foreground">
                              Current: {point.current_rake}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {getLoadingPointStatus(point.status)}
                        {point.estimated_free && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Free: {new Date(point.estimated_free).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Scheduling Insight</span>
                  </div>
                  <p className="text-sm text-foreground">
                    Optimal loading schedule suggests LP-A2 and LP-B2 for next urgent orders. 
                    Expected throughput increase of 18% with current configuration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Resource Utilization Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Resource Utilization Summary
            </CardTitle>
            <CardDescription>
              Overall resource efficiency across all SAIL facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 text-center bg-success/10 rounded-lg border border-success/20">
                <div className="text-2xl font-bold text-success">87%</div>
                <div className="text-sm text-muted-foreground">Avg. Stockyard Utilization</div>
              </div>
              <div className="p-4 text-center bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">325</div>
                <div className="text-sm text-muted-foreground">Available Wagons</div>
              </div>
              <div className="p-4 text-center bg-warning/10 rounded-lg border border-warning/20">
                <div className="text-2xl font-bold text-warning">60%</div>
                <div className="text-sm text-muted-foreground">Loading Point Utilization</div>
              </div>
              <div className="p-4 text-center bg-success/10 rounded-lg border border-success/20">
                <div className="text-2xl font-bold text-success">96%</div>
                <div className="text-sm text-muted-foreground">Resource Efficiency Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Resources;