export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      blocked_hours: {
        Row: {
          blocked_date: string;
          created_at: string;
          end_time: string;
          id: string;
          reason: string | null;
          space_id: string;
          start_time: string;
          updated_at: string;
        };
        Insert: {
          blocked_date: string;
          created_at?: string;
          end_time: string;
          id?: string;
          reason?: string | null;
          space_id: string;
          start_time: string;
          updated_at?: string;
        };
        Update: {
          blocked_date?: string;
          created_at?: string;
          end_time?: string;
          id?: string;
          reason?: string | null;
          space_id?: string;
          start_time?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blocked_hours_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
        ];
      };
      bookings: {
        Row: {
          created_at: string;
          end_date: string;
          end_time: string;
          guests_count: number;
          id: string;
          notes: string | null;
          payment_status: string | null;
          space_id: string;
          start_date: string;
          start_time: string;
          status: string;
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          total_amount: number;
          total_hours: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          end_date: string;
          end_time: string;
          guests_count?: number;
          id?: string;
          notes?: string | null;
          payment_status?: string | null;
          space_id: string;
          start_date: string;
          start_time: string;
          status?: string;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          total_amount: number;
          total_hours: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          end_date?: string;
          end_time?: string;
          guests_count?: number;
          id?: string;
          notes?: string | null;
          payment_status?: string | null;
          space_id?: string;
          start_date?: string;
          start_time?: string;
          status?: string;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          total_amount?: number;
          total_hours?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          name: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          space_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          space_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          space_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'conversations_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
        ];
      };
      favorites: {
        Row: {
          created_at: string;
          id: string;
          space_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          space_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          space_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          conversation_id: string;
          created_at: string;
          id: string;
          is_read: boolean;
          sender_id: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          sender_id: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string | null;
          id: string;
          is_read: boolean | null;
          message: string;
          related_id: string | null;
          title: string;
          type: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          message: string;
          related_id?: string | null;
          title: string;
          type: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_read?: boolean | null;
          message?: string;
          related_id?: string | null;
          title?: string;
          type?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          address: Json | null;
          avatar_url: string | null;
          bio: string | null;
          company: string | null;
          created_at: string;
          date_of_birth: string | null;
          full_name: string | null;
          id: string;
          is_host: boolean | null;
          is_identity_verified: boolean | null;
          is_superhost: boolean | null;
          languages: string[] | null;
          occupation: string | null;
          onboarding_completed: boolean | null;
          onboarding_completed_at: string | null;
          phone: string | null;
          response_rate: number | null;
          response_time_hours: number | null;
          updated_at: string;
          user_id: string;
          work_description: string | null;
        };
        Insert: {
          address?: Json | null;
          avatar_url?: string | null;
          bio?: string | null;
          company?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          full_name?: string | null;
          id?: string;
          is_host?: boolean | null;
          is_identity_verified?: boolean | null;
          is_superhost?: boolean | null;
          languages?: string[] | null;
          occupation?: string | null;
          onboarding_completed?: boolean | null;
          onboarding_completed_at?: string | null;
          phone?: string | null;
          response_rate?: number | null;
          response_time_hours?: number | null;
          updated_at?: string;
          user_id: string;
          work_description?: string | null;
        };
        Update: {
          address?: Json | null;
          avatar_url?: string | null;
          bio?: string | null;
          company?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          full_name?: string | null;
          id?: string;
          is_host?: boolean | null;
          is_identity_verified?: boolean | null;
          is_superhost?: boolean | null;
          languages?: string[] | null;
          occupation?: string | null;
          onboarding_completed?: boolean | null;
          onboarding_completed_at?: string | null;
          phone?: string | null;
          response_rate?: number | null;
          response_time_hours?: number | null;
          updated_at?: string;
          user_id?: string;
          work_description?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          booking_id: string | null;
          comment: string | null;
          created_at: string;
          id: string;
          rating: number;
          space_id: string;
          user_id: string;
        };
        Insert: {
          booking_id?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: string;
          rating: number;
          space_id: string;
          user_id: string;
        };
        Update: {
          booking_id?: string | null;
          comment?: string | null;
          created_at?: string;
          id?: string;
          rating?: number;
          space_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_booking_id_fkey';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      spaces: {
        Row: {
          address: string;
          address_object: Json | null;
          amenities: string[] | null;
          area_sqm: number | null;
          availability_hours: Json | null;
          capacity: number;
          category_id: string | null;
          city: string;
          created_at: string;
          description: string | null;
          features: string[] | null;
          discounts: Json | null;
          id: string;
          images: string[] | null;
          is_active: boolean | null;
          owner_id: string;
          policies: string | null;
          price_per_hour: number;
          rating: number | null;
          service_hours: Json | null;
          title: string;
          total_reviews: number | null;
          updated_at: string;
        };
        Insert: {
          address: string;
          address_object?: Json | null;
          amenities?: string[] | null;
          area_sqm?: number | null;
          availability_hours?: Json | null;
          capacity: number;
          category_id?: string | null;
          city: string;
          created_at?: string;
          description?: string | null;
          features?: string[] | null;
          discounts?: Json | null;
          id?: string;
          images?: string[] | null;
          is_active?: boolean | null;
          owner_id: string;
          policies?: string | null;
          price_per_hour: number;
          rating?: number | null;
          service_hours?: Json | null;
          title: string;
          total_reviews?: number | null;
          updated_at?: string;
        };
        Update: {
          address?: string;
          address_object?: Json | null;
          amenities?: string[] | null;
          area_sqm?: number | null;
          availability_hours?: Json | null;
          capacity?: number;
          category_id?: string | null;
          city?: string;
          created_at?: string;
          description?: string | null;
          features?: string[] | null;
          discounts?: Json | null;
          id?: string;
          images?: string[] | null;
          is_active?: boolean | null;
          owner_id?: string;
          policies?: string | null;
          price_per_hour?: number;
          rating?: number | null;
          service_hours?: Json | null;
          title?: string;
          total_reviews?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'spaces_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'spaces_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      stripe_connect_accounts: {
        Row: {
          account_enabled: boolean | null;
          charges_enabled: boolean | null;
          created_at: string | null;
          details_submitted: boolean | null;
          id: string;
          onboarding_url: string | null;
          payouts_enabled: boolean | null;
          stripe_account_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          account_enabled?: boolean | null;
          charges_enabled?: boolean | null;
          created_at?: string | null;
          details_submitted?: boolean | null;
          id?: string;
          onboarding_url?: string | null;
          payouts_enabled?: boolean | null;
          stripe_account_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          account_enabled?: boolean | null;
          charges_enabled?: boolean | null;
          created_at?: string | null;
          details_submitted?: boolean | null;
          id?: string;
          onboarding_url?: string | null;
          payouts_enabled?: boolean | null;
          stripe_account_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      amenities: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          icon_key: string | null;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          icon_key?: string | null;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          icon_key?: string | null;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'amenities_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      space_amenities: {
        Row: {
          amenity_id: string;
          created_at: string | null;
          id: string;
          space_id: string;
        };
        Insert: {
          amenity_id: string;
          created_at?: string | null;
          id?: string;
          space_id: string;
        };
        Update: {
          amenity_id?: string;
          created_at?: string | null;
          id?: string;
          space_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'space_amenities_amenity_id_fkey';
            columns: ['amenity_id'];
            isOneToOne: false;
            referencedRelation: 'amenities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'space_amenities_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
        ];
      };
      space_characteristics: {
        Row: {
          created_at: string | null;
          description: string | null;
          icon_key: string | null;
          id: string;
          space_id: string;
          title: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          icon_key?: string | null;
          id?: string;
          space_id: string;
          title: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          icon_key?: string | null;
          id?: string;
          space_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'space_characteristics_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
