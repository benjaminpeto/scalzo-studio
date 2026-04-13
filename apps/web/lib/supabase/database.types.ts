export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          note: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          note?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          note?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      case_studies: {
        Row: {
          approach: string | null;
          challenge: string | null;
          client_name: string | null;
          cover_image_url: string | null;
          created_at: string;
          gallery_urls: string[] | null;
          id: string;
          industry: string | null;
          outcomes: string | null;
          outcomes_metrics: Json | null;
          published: boolean;
          published_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          services: string[] | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          approach?: string | null;
          challenge?: string | null;
          client_name?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          gallery_urls?: string[] | null;
          id?: string;
          industry?: string | null;
          outcomes?: string | null;
          outcomes_metrics?: Json | null;
          published?: boolean;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          services?: string[] | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          approach?: string | null;
          challenge?: string | null;
          client_name?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          gallery_urls?: string[] | null;
          id?: string;
          industry?: string | null;
          outcomes?: string | null;
          outcomes_metrics?: Json | null;
          published?: boolean;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          services?: string[] | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          created_at: string;
          event_name: string;
          id: string;
          page_path: string | null;
          properties: Json | null;
          referrer: string | null;
          session_id: string | null;
          user_agent: string | null;
        };
        Insert: {
          created_at?: string;
          event_name: string;
          id?: string;
          page_path?: string | null;
          properties?: Json | null;
          referrer?: string | null;
          session_id?: string | null;
          user_agent?: string | null;
        };
        Update: {
          created_at?: string;
          event_name?: string;
          id?: string;
          page_path?: string | null;
          properties?: Json | null;
          referrer?: string | null;
          session_id?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          budget_band: string | null;
          company: string | null;
          created_at: string;
          email: string | null;
          id: string;
          internal_notes: string | null;
          message: string | null;
          name: string | null;
          page_path: string | null;
          services_interest: string[] | null;
          source_utm: Json | null;
          status: string;
          timeline_band: string | null;
          website: string | null;
        };
        Insert: {
          budget_band?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          internal_notes?: string | null;
          message?: string | null;
          name?: string | null;
          page_path?: string | null;
          services_interest?: string[] | null;
          source_utm?: Json | null;
          status?: string;
          timeline_band?: string | null;
          website?: string | null;
        };
        Update: {
          budget_band?: string | null;
          company?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          internal_notes?: string | null;
          message?: string | null;
          name?: string | null;
          page_path?: string | null;
          services_interest?: string[] | null;
          source_utm?: Json | null;
          status?: string;
          timeline_band?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          alt_text: string | null;
          blur_data_url: string | null;
          bucket_id: string;
          created_at: string;
          height: number;
          id: string;
          kind: string;
          object_path: string;
          public_url: string;
          updated_at: string;
          width: number;
        };
        Insert: {
          alt_text?: string | null;
          blur_data_url?: string | null;
          bucket_id: string;
          created_at?: string;
          height: number;
          id?: string;
          kind: string;
          object_path: string;
          public_url: string;
          updated_at?: string;
          width: number;
        };
        Update: {
          alt_text?: string | null;
          blur_data_url?: string | null;
          bucket_id?: string;
          created_at?: string;
          height?: number;
          id?: string;
          kind?: string;
          object_path?: string;
          public_url?: string;
          updated_at?: string;
          width?: number;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          confirmation_expires_at: string | null;
          confirmation_sent_at: string | null;
          confirmation_token_hash: string | null;
          confirmed_at: string | null;
          created_at: string;
          email: string;
          id: string;
          page_path: string;
          placement: string;
          provider: string;
          provider_contact_id: string | null;
          status: string;
          unsubscribed_at: string | null;
          updated_at: string;
        };
        Insert: {
          confirmation_expires_at?: string | null;
          confirmation_sent_at?: string | null;
          confirmation_token_hash?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          page_path?: string;
          placement: string;
          provider?: string;
          provider_contact_id?: string | null;
          status?: string;
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          confirmation_expires_at?: string | null;
          confirmation_sent_at?: string | null;
          confirmation_token_hash?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          page_path?: string;
          placement?: string;
          provider?: string;
          provider_contact_id?: string | null;
          status?: string;
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      watchdog_events: {
        Row: {
          context: Json;
          created_at: string;
          id: string;
          reason: string;
          source: string;
          status: string;
        };
        Insert: {
          context?: Json;
          created_at?: string;
          id?: string;
          reason: string;
          source: string;
          status: string;
        };
        Update: {
          context?: Json;
          created_at?: string;
          id?: string;
          reason?: string;
          source?: string;
          status?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          content_md: string;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          published: boolean;
          published_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          content_md: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          content_md?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      redirects: {
        Row: {
          created_at: string;
          from_path: string;
          id: string;
          status_code: number;
          to_path: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          from_path: string;
          id?: string;
          status_code?: number;
          to_path: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          from_path?: string;
          id?: string;
          status_code?: number;
          to_path?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          content_md: string | null;
          created_at: string;
          deliverables: string[] | null;
          id: string;
          order_index: number;
          published: boolean;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          summary: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          content_md?: string | null;
          created_at?: string;
          deliverables?: string[] | null;
          id?: string;
          order_index?: number;
          published?: boolean;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          summary?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          content_md?: string | null;
          created_at?: string;
          deliverables?: string[] | null;
          id?: string;
          order_index?: number;
          published?: boolean;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          summary?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          avatar_url: string | null;
          company: string | null;
          created_at: string;
          featured: boolean;
          id: string;
          name: string;
          published: boolean;
          quote: string;
          role: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          company?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          name: string;
          published?: boolean;
          quote: string;
          role?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          company?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          name?: string;
          published?: boolean;
          quote?: string;
          role?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      bootstrap_first_admin: {
        Args: { admin_note?: string; target_email: string };
        Returns: string;
      };
      is_admin: {
        Args: { uid: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof DatabaseWithoutInternals,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer Row;
    }
    ? Row
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer Row;
      }
      ? Row
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer Insert;
    }
    ? Insert
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer Insert;
      }
      ? Insert
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer Update;
    }
    ? Update
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer Update;
      }
      ? Update
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  DefaultSchemaCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends DefaultSchemaCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = DefaultSchemaCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : DefaultSchemaCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][DefaultSchemaCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

type PublicSchema = Database["public"];

export type TableName = keyof PublicSchema["Tables"];
export type TableRow<Name extends TableName> = Tables<Name>;
export type TableInsert<Name extends TableName> = TablesInsert<Name>;
export type TableUpdate<Name extends TableName> = TablesUpdate<Name>;
