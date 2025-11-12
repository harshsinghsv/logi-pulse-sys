export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string
          id: string
          status: string
          timestamp: string | null
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description: string
          id?: string
          status?: string
          timestamp?: string | null
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string
          id?: string
          status?: string
          timestamp?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_cache: {
        Row: {
          carbon_data: Json | null
          green_suggestion: string | null
          id: string
          mode_data: Json | null
          updated_at: string | null
        }
        Insert: {
          carbon_data?: Json | null
          green_suggestion?: string | null
          id: string
          mode_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          carbon_data?: Json | null
          green_suggestion?: string | null
          id?: string
          mode_data?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kpi_cache: {
        Row: {
          ai_suggestion: string | null
          id: string
          optimized_cost: number | null
          sla_at_risk_percent: number | null
          total_orders: number | null
          updated_at: string | null
        }
        Insert: {
          ai_suggestion?: string | null
          id: string
          optimized_cost?: number | null
          sla_at_risk_percent?: number | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_suggestion?: string | null
          id?: string
          optimized_cost?: number | null
          sla_at_risk_percent?: number | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loading_points: {
        Row: {
          capacity_wagons_per_day: number
          current_rake_id: string | null
          estimated_free: string | null
          id: string
          loading_point_id: string
          name: string
          plant: string
          status: string
          updated_at: string | null
        }
        Insert: {
          capacity_wagons_per_day: number
          current_rake_id?: string | null
          estimated_free?: string | null
          id?: string
          loading_point_id: string
          name: string
          plant: string
          status: string
          updated_at?: string | null
        }
        Update: {
          capacity_wagons_per_day?: number
          current_rake_id?: string | null
          estimated_free?: string | null
          id?: string
          loading_point_id?: string
          name?: string
          plant?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          customer_name: string
          destination: string
          id: string
          order_id: string
          plant: string | null
          priority: string
          product: string
          rake_id: string | null
          status: string
          tonnage: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name: string
          destination: string
          id?: string
          order_id: string
          plant?: string | null
          priority: string
          product: string
          rake_id?: string | null
          status?: string
          tonnage: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string
          destination?: string
          id?: string
          order_id?: string
          plant?: string | null
          priority?: string
          product?: string
          rake_id?: string | null
          status?: string
          tonnage?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      rake_plans: {
        Row: {
          assigned_order_ids: string[] | null
          co2_emissions: number | null
          created_at: string | null
          destination: string
          efficiency_score: number | null
          eta: string | null
          id: string
          loaded_wagons: number | null
          plant: string
          rake_id: string
          status: string
          tonnage: number
          total_wagons: number
          updated_at: string | null
          utilization_percent: number | null
        }
        Insert: {
          assigned_order_ids?: string[] | null
          co2_emissions?: number | null
          created_at?: string | null
          destination: string
          efficiency_score?: number | null
          eta?: string | null
          id?: string
          loaded_wagons?: number | null
          plant: string
          rake_id: string
          status: string
          tonnage: number
          total_wagons: number
          updated_at?: string | null
          utilization_percent?: number | null
        }
        Update: {
          assigned_order_ids?: string[] | null
          co2_emissions?: number | null
          created_at?: string | null
          destination?: string
          efficiency_score?: number | null
          eta?: string | null
          id?: string
          loaded_wagons?: number | null
          plant?: string
          rake_id?: string
          status?: string
          tonnage?: number
          total_wagons?: number
          updated_at?: string | null
          utilization_percent?: number | null
        }
        Relationships: []
      }
      stockyards: {
        Row: {
          ai_suggestion: string | null
          capacity_mt: number
          current_stock_mt: number | null
          id: string
          location: string
          material_type: string
          name: string
          stockyard_id: string
          updated_at: string | null
          utilization_percent: number | null
        }
        Insert: {
          ai_suggestion?: string | null
          capacity_mt: number
          current_stock_mt?: number | null
          id?: string
          location: string
          material_type: string
          name: string
          stockyard_id: string
          updated_at?: string | null
          utilization_percent?: number | null
        }
        Update: {
          ai_suggestion?: string | null
          capacity_mt?: number
          current_stock_mt?: number | null
          id?: string
          location?: string
          material_type?: string
          name?: string
          stockyard_id?: string
          updated_at?: string | null
          utilization_percent?: number | null
        }
        Relationships: []
      }
      wagons: {
        Row: {
          capacity_mt: number
          current_location: string | null
          id: string
          status: string
          updated_at: string | null
          wagon_id: string
          wagon_type: string
        }
        Insert: {
          capacity_mt: number
          current_location?: string | null
          id?: string
          status: string
          updated_at?: string | null
          wagon_id: string
          wagon_type: string
        }
        Update: {
          capacity_mt?: number
          current_location?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          wagon_id?: string
          wagon_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
