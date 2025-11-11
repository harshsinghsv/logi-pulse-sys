import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { db, APP_ID } from "@/lib/firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { optimizationAPI } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Clock,
  Package,
  AlertTriangle,
  CheckCircle,
  Truck,
  MoreVertical,
  MapPin,
  Calendar,
  User
} from "lucide-react";

interface Order {
  order_id: string;
  customer_name: string;
  product: string;
  tonnage: number;
  priority: string;
  is_urgent: boolean;
  deadline: string;
  status: string;
  assigned_rake: string | null;
  plant: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reassigningOrders, setReassigningOrders] = useState<Set<string>>(new Set());
  const { userId } = useAuth();

  // Real-time orders listener
  useEffect(() => {
    const ordersRef = collection(db, `artifacts/${APP_ID}/public/data/orders`);

    const unsubscribe = onSnapshot(
      ordersRef,
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          ...doc.data(),
          order_id: doc.id
        })) as Order[];
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to orders:', error);
        // Fallback to static data
        import('@/data/orders.json')
          .then(module => {
            const data = module.default as Order[];
            setOrders(data);
            setLoading(false);
          })
          .catch(err => {
            console.error('Error loading fallback orders:', err);
            setLoading(false);
          });
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, priorityFilter, statusFilter]);

  const calculateTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    
    if (diffTime <= 0) {
      return { text: "Overdue", color: "text-destructive", urgent: true };
    }
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return { text: `${diffHours}h remaining`, color: "text-destructive", urgent: true };
    } else if (diffDays <= 3) {
      return { text: `${diffDays}d remaining`, color: "text-warning", urgent: false };
    } else {
      return { text: `${diffDays}d remaining`, color: "text-muted-foreground", urgent: false };
    }
  };

  const getPriorityBadge = (priority: string, isUrgent: boolean) => {
    if (isUrgent) {
      return <Badge className="bg-destructive text-destructive-foreground animate-pulse">Urgent</Badge>;
    }
    
    const priorityConfig = {
      "Critical": { variant: "destructive" as const },
      "High": { variant: "default" as const },
      "Medium": { variant: "secondary" as const },
      "Low": { variant: "outline" as const }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || { variant: "outline" as const };
    return <Badge variant={config.variant}>{priority}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Planning": { variant: "secondary" as const, className: "bg-warning/20 text-warning-foreground" },
      "In-Transit": { variant: "default" as const, className: "bg-primary/20 text-primary-foreground" },
      "Delivered": { variant: "outline" as const, className: "bg-success/20 text-success-foreground" },
      "Pending": { variant: "secondary" as const, className: "bg-muted" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: "secondary" as const, className: "" };
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const handleReassign = async (orderId: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to reassign orders.",
        variant: "destructive"
      });
      return;
    }

    setReassigningOrders(prev => new Set(prev).add(orderId));

    try {
      // Call AI Optimization Engine
      await optimizationAPI.reassignOrder({
        order_id: orderId,
        userId: userId
      });

      toast({
        title: "AI Optimization Started",
        description: `Order ${orderId} is being reassigned by the Optimization Engine. This may take 1-2 minutes.`,
      });
    } catch (error) {
      console.error('Reassignment error:', error);
      toast({
        title: "Reassignment Failed",
        description: error instanceof Error ? error.message : "Failed to reassign order",
        variant: "destructive"
      });
      setReassigningOrders(prev => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  const handleForceAssign = async (orderId: string) => {
    try {
      const orderRef = doc(db, `artifacts/${APP_ID}/public/data/orders`, orderId);
      await updateDoc(orderRef, {
        status: "Planning",
        assigned_rake: `RAKE-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      });

      toast({
        title: "Force Assignment Complete",
        description: `Order ${orderId} has been forcefully assigned to a new rake.`,
      });
    } catch (error) {
      console.error('Force assign error:', error);
      toast({
        title: "Assignment Failed",
        description: "Failed to force assign order",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Order Management</h2>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-destructive/10 text-destructive-foreground">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {filteredOrders.filter(o => o.is_urgent).length} Urgent
          </Badge>
          <Badge variant="outline">
            {filteredOrders.length} Total Orders
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In-Transit">In-Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="justify-start">
              <Package className="w-4 h-4 mr-2" />
              Export Orders
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order, index) => {
          const timeRemaining = calculateTimeRemaining(order.deadline);
          
          return (
            <motion.div
              key={order.order_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`shadow-card hover:shadow-steel transition-all duration-300 ${
                order.is_urgent ? 'border-destructive shadow-destructive/20' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{order.order_id}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {order.customer_name}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getPriorityBadge(order.priority, order.is_urgent)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Product:</span>
                      <span className="font-medium">{order.product}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tonnage:</span>
                      <span className="font-medium">{order.tonnage.toLocaleString()} T</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Plant:</span>
                      <span className="font-medium">{order.plant}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Assigned Rake:</span>
                      <span className="font-medium">
                        {order.assigned_rake ? (
                          <Badge variant="outline">{order.assigned_rake}</Badge>
                        ) : (
                          <span className="text-warning">Not Assigned</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* SLA Countdown */}
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${timeRemaining.color}`} />
                      <span className="text-sm font-medium">Deadline</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${timeRemaining.color}`}>
                        {timeRemaining.text}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleReassign(order.order_id)}
                      disabled={!order.assigned_rake || reassigningOrders.has(order.order_id)}
                    >
                      {reassigningOrders.has(order.order_id) ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Truck className="w-3 h-3 mr-1" />
                          AI Reassign
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleForceAssign(order.order_id)}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Force Assign
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order Details: {order.order_id}</DialogTitle>
                          <DialogDescription>
                            Complete order information and tracking details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Customer Information</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Customer:</span>
                                  <span>{order.customer_name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Order ID:</span>
                                  <span>{order.order_id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Priority:</span>
                                  {getPriorityBadge(order.priority, order.is_urgent)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Product Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Product:</span>
                                  <span>{order.product}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tonnage:</span>
                                  <span>{order.tonnage.toLocaleString()} T</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Plant:</span>
                                  <span>{order.plant}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Logistics Information</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Assigned Rake:</span>
                                <span>{order.assigned_rake || "Not Assigned"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Deadline:</span>
                                <span>{new Date(order.deadline).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Time Remaining:</span>
                                <span className={timeRemaining.color}>{timeRemaining.text}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleReassign(order.order_id)}
                            >
                              Reassign to Optimal Rake
                            </Button>
                            <Button
                              variant="default"
                              className="flex-1"
                              onClick={() => handleForceAssign(order.order_id)}
                            >
                              Force Assign to New Rake
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default OrderManagement;