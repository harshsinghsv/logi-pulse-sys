import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

interface AlertItem {
  id: string;
  type: "Critical" | "Warning" | "Info";
  title: string;
  description: string;
  timestamp: string;
}

const Alerts = () => {
  const alerts = useMemo<AlertItem[]>(() => (
    [
      { id: "AL-001", type: "Critical", title: "Demurrage risk at Bokaro", description: "Rake BKSC-042 waiting > 3 hrs at LP-A1.", timestamp: new Date().toISOString() },
      { id: "AL-002", type: "Warning", title: "Wagon maintenance due", description: "12 BOXN wagons scheduled for maintenance this week.", timestamp: new Date(Date.now() - 3600_000).toISOString() },
      { id: "AL-003", type: "Info", title: "New high-priority order", description: "ORD-219 marked as High priority for Patna delivery.", timestamp: new Date(Date.now() - 7200_000).toISOString() },
    ]
  ), []);

  const colorByType: Record<AlertItem["type"], string> = {
    Critical: "bg-destructive/15 text-destructive",
    Warning: "bg-warning/15 text-warning",
    Info: "bg-primary/15 text-primary",
  };

  const IconByType: Record<AlertItem["type"], any> = {
    Critical: AlertTriangle,
    Warning: Clock,
    Info: CheckCircle2,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Real-time issues requiring planner attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((a) => {
            const Icon = IconByType[a.type];
            return (
              <div key={a.id} className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card/60">
                <div className={`p-2 rounded-md ${colorByType[a.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant="outline">{a.id}</Badge>
                      <span className="font-medium text-foreground truncate">{a.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(a.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="secondary">Acknowledge</Button>
                    <Button size="sm" variant="outline">Open Details</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Alerts;
