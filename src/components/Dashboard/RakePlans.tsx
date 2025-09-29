import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  MoreHorizontal,
  Train,
  MapPin,
  Clock,
  Gauge,
  Leaf
} from "lucide-react";

interface RakePlan {
  rake_id: string;
  plant: string;
  destination: string;
  status: string;
  wagon_type: string;
  wagon_count: number;
  total_tonnage: number;
  utilization: number;
  efficiency_score: number;
  co2_emissions_kg: number;
  eta: string;
  assigned_orders: string[];
}

interface Order {
  order_id: string;
  customer_name: string;
  product: string;
  tonnage: number;
  priority: string;
}

const RakePlans = () => {
  const [plans, setPlans] = useState<RakePlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<RakePlan[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [plantFilter, setPlantFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRake, setSelectedRake] = useState<RakePlan | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansResponse, ordersResponse] = await Promise.all([
          fetch('/src/data/plans.json'),
          fetch('/src/data/orders.json')
        ]);
        
        const plansData = await plansResponse.json();
        const ordersData = await ordersResponse.json();
        
        setPlans(plansData);
        setFilteredPlans(plansData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = plans;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.rake_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Plant filter
    if (plantFilter !== "all") {
      filtered = filtered.filter(plan => plan.plant === plantFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(plan => plan.status === statusFilter);
    }

    setFilteredPlans(filtered);
  }, [plans, searchTerm, plantFilter, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Pending": { variant: "secondary" as const, className: "bg-warning/20 text-warning-foreground" },
      "Approved": { variant: "default" as const, className: "bg-success/20 text-success-foreground" },
      "In-Transit": { variant: "outline" as const, className: "bg-primary/20 text-primary-foreground" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: "secondary" as const, className: "" };
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getEfficiencyBadge = (score: number) => {
    if (score >= 95) return <Badge className="bg-success/20 text-success-foreground">{score}%</Badge>;
    if (score >= 85) return <Badge className="bg-warning/20 text-warning-foreground">{score}%</Badge>;
    return <Badge variant="destructive">{score}%</Badge>;
  };

  const handleGenerateNewPlan = () => {
    toast({
      title: "New Plan Generated",
      description: "AI has generated an optimized rake formation plan.",
    });
  };

  const getRakeOrders = (rakeId: string, orderIds: string[]) => {
    return orders.filter(order => orderIds.includes(order.order_id));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
        <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Daily Rake Plan</h2>
          <p className="text-muted-foreground">AI-optimized rake formation and dispatch schedule</p>
        </div>
        <Button onClick={handleGenerateNewPlan} className="shadow-steel">
          <Plus className="w-4 h-4 mr-2" />
          Generate New Plan
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search rake ID or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={plantFilter} onValueChange={setPlantFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Plant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plants</SelectItem>
                <SelectItem value="Bokaro">Bokaro</SelectItem>
                <SelectItem value="Bhilai">Bhilai</SelectItem>
                <SelectItem value="Rourkela">Rourkela</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="In-Transit">In-Transit</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Train className="w-5 h-5" />
              Rake Plans ({filteredPlans.length})
            </span>
            <Badge variant="outline">{new Date().toLocaleDateString()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rake ID</TableHead>
                  <TableHead>Plant</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Wagons</TableHead>
                  <TableHead>Tonnage</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>CO₂ (kg)</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.rake_id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{plan.rake_id}</TableCell>
                    <TableCell>{plan.plant}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {plan.destination}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(plan.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{plan.wagon_count}x</span>
                        <Badge variant="outline">{plan.wagon_type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{plan.total_tonnage.toLocaleString()} T</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={plan.utilization} className="w-12 h-2" />
                        <span className="text-sm font-medium">{plan.utilization}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getEfficiencyBadge(plan.efficiency_score)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-success" />
                        <span className="text-sm">{plan.co2_emissions_kg.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(plan.eta).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRake(plan)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Train className="w-5 h-5" />
                              Rake Details: {plan.rake_id}
                            </DialogTitle>
                            <DialogDescription>
                              Smart queue and order details for this rake formation
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Rake Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Plant:</span>
                                    <span>{plan.plant}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Destination:</span>
                                    <span>{plan.destination}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Wagons:</span>
                                    <span>{plan.wagon_count}x {plan.wagon_type}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Tonnage:</span>
                                    <span>{plan.total_tonnage.toLocaleString()} T</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Performance Metrics</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Utilization:</span>
                                    <span>{plan.utilization}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Efficiency Score:</span>
                                    <span>{plan.efficiency_score}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">CO₂ Emissions:</span>
                                    <span>{plan.co2_emissions_kg.toLocaleString()} kg</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">ETA:</span>
                                    <span>{new Date(plan.eta).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Assigned Orders (Smart Queue)</h4>
                              <div className="space-y-2">
                                {getRakeOrders(plan.rake_id, plan.assigned_orders).map((order, index) => (
                                  <div
                                    key={order.order_id}
                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Badge variant="outline">{index + 1}</Badge>
                                      <div>
                                        <p className="font-medium text-sm">{order.order_id}</p>
                                        <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{order.tonnage.toLocaleString()} T</p>
                                      <Badge 
                                        variant={order.priority === "High" ? "default" : "secondary"}
                                        className="text-xs"
                                      >
                                        {order.priority}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RakePlans;