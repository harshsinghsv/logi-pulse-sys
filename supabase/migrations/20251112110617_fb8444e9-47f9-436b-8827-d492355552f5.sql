-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create KPI Cache table for dashboard overview
CREATE TABLE public.kpi_cache (
  id TEXT PRIMARY KEY,
  total_orders INTEGER DEFAULT 0,
  optimized_cost NUMERIC(10,2) DEFAULT 0,
  sla_at_risk_percent NUMERIC(5,2) DEFAULT 0,
  ai_suggestion TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  product TEXT NOT NULL,
  tonnage NUMERIC(10,2) NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in-transit', 'delivered')),
  rake_id TEXT,
  plant TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Rake Plans table
CREATE TABLE public.rake_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rake_id TEXT UNIQUE NOT NULL,
  plant TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'confirmed', 'loading', 'dispatched')),
  total_wagons INTEGER NOT NULL,
  loaded_wagons INTEGER DEFAULT 0,
  tonnage NUMERIC(10,2) NOT NULL,
  utilization_percent NUMERIC(5,2) DEFAULT 0,
  efficiency_score NUMERIC(5,2) DEFAULT 0,
  co2_emissions NUMERIC(10,2) DEFAULT 0,
  eta TIMESTAMP WITH TIME ZONE,
  assigned_order_ids TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Alerts table (user-specific)
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('critical', 'warning', 'info', 'success')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Resources tables
CREATE TABLE public.stockyards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stockyard_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity_mt NUMERIC(10,2) NOT NULL,
  current_stock_mt NUMERIC(10,2) DEFAULT 0,
  utilization_percent NUMERIC(5,2) DEFAULT 0,
  material_type TEXT NOT NULL,
  ai_suggestion TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.wagons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wagon_id TEXT UNIQUE NOT NULL,
  wagon_type TEXT NOT NULL,
  capacity_mt NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'assigned', 'in-use', 'maintenance')),
  current_location TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.loading_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loading_point_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plant TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'maintenance')),
  capacity_wagons_per_day INTEGER NOT NULL,
  current_rake_id TEXT,
  estimated_free TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Analytics Cache table
CREATE TABLE public.analytics_cache (
  id TEXT PRIMARY KEY,
  mode_data JSONB,
  carbon_data JSONB,
  green_suggestion TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.kpi_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rake_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stockyards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wagons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loading_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public data (everyone can read)
CREATE POLICY "KPI cache is publicly readable" ON public.kpi_cache FOR SELECT USING (true);
CREATE POLICY "Orders are publicly readable" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Rake plans are publicly readable" ON public.rake_plans FOR SELECT USING (true);
CREATE POLICY "Stockyards are publicly readable" ON public.stockyards FOR SELECT USING (true);
CREATE POLICY "Wagons are publicly readable" ON public.wagons FOR SELECT USING (true);
CREATE POLICY "Loading points are publicly readable" ON public.loading_points FOR SELECT USING (true);
CREATE POLICY "Analytics cache is publicly readable" ON public.analytics_cache FOR SELECT USING (true);

-- RLS Policies for user-specific alerts
CREATE POLICY "Users can view their own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rake_plans_updated_at BEFORE UPDATE ON public.rake_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stockyards_updated_at BEFORE UPDATE ON public.stockyards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wagons_updated_at BEFORE UPDATE ON public.wagons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loading_points_updated_at BEFORE UPDATE ON public.loading_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial KPI cache data
INSERT INTO public.kpi_cache (id, total_orders, optimized_cost, sla_at_risk_percent, ai_suggestion)
VALUES ('daily_summary', 0, 0, 0, 'Initialize your system by adding orders and generating rake plans.');

-- Insert initial analytics cache
INSERT INTO public.analytics_cache (id, mode_data, carbon_data, green_suggestion)
VALUES ('analytics_summary', '{}', '{}', 'Start tracking shipments to see carbon analytics.');