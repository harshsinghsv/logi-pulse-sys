import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

const modeData = [
  { mode: "Rail", total_cost_lacs: 120, avg_delivery_hrs: 36 },
  { mode: "Road", total_cost_lacs: 150, avg_delivery_hrs: 24 },
];

const carbonData = [
  { mode: "Rail", co2_per_tkm: 17 },
  { mode: "Road", co2_per_tkm: 62 },
];

const AnalyticsReports = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Mode Comparison */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Dynamic Mode Selection Analysis</CardTitle>
          <CardDescription>Rail vs Road comparison for cost and delivery time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={modeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mode" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="total_cost_lacs" name="Total Cost (₹ Lacs)" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
              <Bar yAxisId="right" dataKey="avg_delivery_hrs" name="Avg Delivery (hrs)" fill="hsl(var(--success))" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-muted-foreground">
            Insight: Rail is cheaper for long-haul bulk; Road is faster for short-haul urgent orders.
          </div>
        </CardContent>
      </Card>

      {/* Carbon Footprint */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Carbon Footprint Estimation</CardTitle>
          <CardDescription>CO₂ emissions per tonne-km by transport mode</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={carbonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mode" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Bar dataKey="co2_per_tkm" name="CO₂ (g per tonne-km)" fill="hsl(var(--warning))" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Badge className="bg-success text-success-foreground">Green Suggestion</Badge>
            <span className="text-muted-foreground">Shift long-haul to Rail to cut emissions by ~3.5x; use Road for short-haul to save time.</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalyticsReports;
