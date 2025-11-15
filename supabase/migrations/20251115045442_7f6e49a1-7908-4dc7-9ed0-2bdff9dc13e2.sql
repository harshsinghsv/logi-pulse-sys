-- Add missing columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT FALSE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days');
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS assigned_rake TEXT;

-- Update assigned_rake to match existing rake_id
UPDATE public.orders SET assigned_rake = rake_id WHERE rake_id IS NOT NULL;

-- Add missing KPI fields (stored as JSONB for flexibility)
ALTER TABLE public.kpi_cache ADD COLUMN IF NOT EXISTS kpi_data JSONB DEFAULT '{}'::jsonb;

-- Populate KPI data with initial values
UPDATE public.kpi_cache SET kpi_data = jsonb_build_object(
  'total_orders_today', 42,
  'rakes_formed', 8,
  'sla_at_risk_percent', 8.5,
  'avg_rake_utilization', 87.3,
  'idle_wagons', 12,
  'total_optimized_cost', 15500000,
  'cost_change_percent', -3.2,
  'on_time_delivery', 94.5,
  'dispatched_today', 6,
  'logistics_cost_trend', '[]'::jsonb,
  'orders_by_plant', '[
    {"plant": "BSP", "orders": 15, "value": 5200000},
    {"plant": "DSP", "orders": 12, "value": 4100000},
    {"plant": "RSP", "orders": 10, "value": 3800000},
    {"plant": "IISCO", "orders": 5, "value": 2400000}
  ]'::jsonb
) WHERE id = 'daily_summary';