import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Map, 
  MapPin, 
  Clock, 
  Navigation,
  Train,
  Truck,
  AlertCircle,
  CheckCircle,
  Timer,
  Route
} from "lucide-react";

interface TrackingItem {
  id: string;
  type: string;
  location: string;
  next_stop: string;
  eta: string;
  status: string;
  coordinates: number[];
  progress: Array<{
    station: string;
    status: string;
    time: string;
  }>;
}

const LiveTracking = () => {
  const [trackingData, setTrackingData] = useState<TrackingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TrackingItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await fetch('/src/data/tracking.json');
        const data = await response.json();
        setTrackingData(data);
        if (data.length > 0) {
          setSelectedItem(data[0]);
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "On Time": { 
        variant: "default" as const, 
        className: "bg-success/20 text-success-foreground",
        icon: CheckCircle 
      },
      "Delayed": { 
        variant: "destructive" as const, 
        className: "bg-destructive/20 text-destructive-foreground",
        icon: AlertCircle 
      },
      "Early": { 
        variant: "secondary" as const, 
        className: "bg-primary/20 text-primary-foreground",
        icon: Timer 
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

  const getProgressPercentage = (progress: TrackingItem['progress']) => {
    const completed = progress.filter(p => p.status === "Completed").length;
    return (completed / progress.length) * 100;
  };

  const getStepStatus = (status: string) => {
    switch (status) {
      case "Completed":
        return { icon: CheckCircle, className: "text-success bg-success/20" };
      case "Current":
        return { icon: MapPin, className: "text-primary bg-primary/20" };
      default:
        return { icon: Clock, className: "text-muted-foreground bg-muted" };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
        <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
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
        <h2 className="text-2xl font-semibold mb-2">Live Tracking</h2>
        <p className="text-muted-foreground">
          Real-time tracking of rakes and trucks across India
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Assets
                </p>
                <div className="text-2xl font-bold text-foreground">
                  {trackingData.length}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Map className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  On Time
                </p>
                <div className="text-2xl font-bold text-success">
                  {trackingData.filter(item => item.status === "On Time").length}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Delayed
                </p>
                <div className="text-2xl font-bold text-warning">
                  {trackingData.filter(item => item.status === "Delayed").length}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Avg. On-Time %
                </p>
                <div className="text-2xl font-bold text-primary">96%</div>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Timer className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Map View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-card h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Live Map View
              </CardTitle>
              <CardDescription>
                Interactive map showing real-time asset locations
              </CardDescription>
            </CardHeader>
            <CardContent className="relative h-full">
              {/* Mock India Map */}
              <div className="absolute inset-4 bg-muted/20 rounded-lg flex items-center justify-center border border-border">
                <div className="text-center space-y-4">
                  <Map className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Interactive Map</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click on asset markers to view details
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {trackingData.map((item) => (
                        <Button
                          key={item.id}
                          variant={selectedItem?.id === item.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          className="text-xs"
                        >
                          {item.type === "Rake" ? (
                            <Train className="w-3 h-3 mr-1" />
                          ) : (
                            <Truck className="w-3 h-3 mr-1" />
                          )}
                          {item.id}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Asset Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-card h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedItem?.type === "Rake" ? (
                  <Train className="w-5 h-5" />
                ) : (
                  <Truck className="w-5 h-5" />
                )}
                Asset Details
              </CardTitle>
              <CardDescription>
                {selectedItem ? `Tracking information for ${selectedItem.id}` : "Select an asset to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedItem ? (
                <>
                  {/* Basic Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Asset ID</span>
                      <Badge variant="outline">{selectedItem.id}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      {getStatusBadge(selectedItem.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Location</span>
                      <span className="text-sm font-semibold">{selectedItem.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Next Stop</span>
                      <span className="text-sm">{selectedItem.next_stop}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">ETA</span>
                      <span className="text-sm">
                        {new Date(selectedItem.eta).toLocaleDateString()} {new Date(selectedItem.eta).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Journey Progress</span>
                      <span>{Math.round(getProgressPercentage(selectedItem.progress))}%</span>
                    </div>
                    <Progress value={getProgressPercentage(selectedItem.progress)} className="h-2" />
                  </div>

                  {/* Shipment Timeline */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Route className="w-4 h-4" />
                      Shipment Timeline
                    </h4>
                    <div className="space-y-3">
                      {selectedItem.progress.map((step, index) => {
                        const stepConfig = getStepStatus(step.status);
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stepConfig.className}`}>
                              <stepConfig.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{step.station}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(step.time).toLocaleDateString()} {new Date(step.time).toLocaleTimeString()}
                              </p>
                            </div>
                            <Badge 
                              variant={step.status === "Completed" ? "default" : step.status === "Current" ? "secondary" : "outline"}
                              className="text-xs"
                            >
                              {step.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select an asset from the map to view tracking details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Assets List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              All Assets
            </CardTitle>
            <CardDescription>
              Complete list of tracked assets and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trackingData.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedItem?.id === item.id 
                      ? 'border-primary bg-primary/5 shadow-steel' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.type === "Rake" ? (
                        <Train className="w-5 h-5 text-primary" />
                      ) : (
                        <Truck className="w-5 h-5 text-primary" />
                      )}
                      <div>
                        <p className="font-semibold">{item.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.location} → {item.next_stop}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(item.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        ETA: {new Date(item.eta).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LiveTracking;