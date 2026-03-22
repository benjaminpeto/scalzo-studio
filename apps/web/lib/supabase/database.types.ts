export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
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
          content_md?: string;
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
      };
    };
    Views: Record<string, never>;
    Functions: {
      bootstrap_first_admin: {
        Args: {
          admin_note?: string;
          target_email: string;
        };
        Returns: string;
      };
      is_admin: {
        Args: {
          uid: string;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

type PublicSchema = Database["public"];

export type TableName = keyof PublicSchema["Tables"];

export type TableRow<Name extends TableName> =
  PublicSchema["Tables"][Name]["Row"];

export type TableInsert<Name extends TableName> =
  PublicSchema["Tables"][Name]["Insert"];

export type TableUpdate<Name extends TableName> =
  PublicSchema["Tables"][Name]["Update"];
