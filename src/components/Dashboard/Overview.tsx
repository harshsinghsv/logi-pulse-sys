import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Clock, 
  AlertTriangle, 
  Train,
  Calendar,
  DollarSign
} from "lucide-react";

interface KPIData {
  total_orders_today: number;
  rakes_formed: number;
  sla_at_risk_percent: number;
  avg_rake_utilization: number;
  idle_wagons: number;
  total_optimized_cost: number;
  cost_change_percent: number;
  on_time_delivery: number;
  dispatched_today: number;
  logistics_cost_trend: Array<{ date: string; cost: number; utilization: number }>;
  orders_by_plant: Array<{ plant: string; orders: number; value: number }>;
}

const Overview = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKPIData = async () => {
      try {
        const module = await import('@/data/kpis.json');
        const data = module.default;
        setKpiData(data as KPIData);
      } catch (error) {
        console.error('Error loading KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKPIData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!kpiData) return null;

  const kpiCards = [
    {
      title: "Total Orders Today",
      value: kpiData.total_orders_today,
      subtitle: "Active orders",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Rakes Formed", 
      value: kpiData.rakes_formed,
      subtitle: "Today's formations",
      icon: Train,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "SLA at Risk",
      value: `${kpiData.sla_at_risk_percent}%`,
      subtitle: "Requires attention",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Avg. Rake Utilization",
      value: `${kpiData.avg_rake_utilization}%`,
      subtitle: "Efficiency score",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      showProgress: true,
      progressValue: kpiData.avg_rake_utilization
    }
  ];

  const costKpiCards = [
    {
      title: "Total Optimized Cost",
      value: `₹${(kpiData.total_optimized_cost / 10000000).toFixed(1)} Cr`,
      subtitle: `${kpiData.cost_change_percent}% from yesterday`,
      icon: DollarSign,
      color: kpiData.cost_change_percent < 0 ? "text-success" : "text-warning",
      bgColor: kpiData.cost_change_percent < 0 ? "bg-success/10" : "bg-warning/10",
      trend: kpiData.cost_change_percent < 0 ? TrendingDown : TrendingUp
    },
    {
      title: "Wagons Available", 
      value: kpiData.idle_wagons,
      subtitle: "Ready for dispatch",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Rakes Dispatched Today",
      value: kpiData.dispatched_today,
      subtitle: "In transit",
      icon: Train,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "On-Time Delivery",
      value: `${kpiData.on_time_delivery}%`,
      subtitle: "Performance metric",
      icon: Clock,
      color: "text-success", 
      bgColor: "bg-success/10"
    }
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Date and Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        <Button variant="outline" className="shadow-sm">
          Export Report
        </Button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-steel transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {kpi.title}
                    </p>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {kpi.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {kpi.subtitle}
                    </p>
                    {kpi.showProgress && (
                      <Progress 
                        value={kpi.progressValue} 
                        className="mt-3 h-2" 
                      />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {costKpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
          >
            <Card className="shadow-card hover:shadow-steel transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {kpi.title}
                    </p>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {kpi.value}
                    </div>
                    <div className="flex items-center gap-1">
                      {kpi.trend && <kpi.trend className={`w-3 h-3 ${kpi.color}`} />}
                      <p className={`text-xs ${kpi.color}`}>
                        {kpi.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Logistics Cost Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-success" />
                Logistics Cost vs. Utilization (Last 30 Days)
              </CardTitle>
              <CardDescription>
                Track cost optimization and utilization trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={kpiData.logistics_cost_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="cost"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="utilization"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'calc(var(--radius) - 2px)'
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="cost"
                    type="monotone" 
                    dataKey="cost" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Cost (₹)"
                  />
                  <Line 
                    yAxisId="utilization"
                    type="monotone" 
                    dataKey="utilization" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Utilization (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart - Orders by Plant */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Orders by Plant
              </CardTitle>
              <CardDescription>
                Distribution of active orders across SAIL plants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={kpiData.orders_by_plant}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="plant" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'calc(var(--radius) - 2px)'
                    }}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Plant Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Plant Performance Summary</CardTitle>
            <CardDescription>
              Real-time performance metrics for each SAIL plant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kpiData.orders_by_plant.map((plant, index) => (
                <div key={plant.plant} className="p-4 border border-border rounded-lg bg-muted/30">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{plant.plant}</h4>
                    <Badge variant="outline">{plant.orders} orders</Badge>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    ₹{(plant.value / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-xs text-muted-foreground">Order value</p>
                  <Progress 
                    value={(plant.orders / Math.max(...kpiData.orders_by_plant.map(p => p.orders))) * 100} 
                    className="mt-2 h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Overview;