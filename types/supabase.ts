export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_email_fkey"
            columns: ["email"]
            referencedRelation: "users"
            referencedColumns: ["email"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      coloring_pages: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          image_url: string
          thumbnail_url: string
          category_id: string
          slug: string
          difficulty_level: string
          age_group: string
          is_featured: boolean
          download_count: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          price: number
          image_url: string
          thumbnail_url?: string
          category_id?: string
          slug: string
          difficulty_level?: string
          age_group?: string
          is_featured?: boolean
          download_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          image_url?: string
          thumbnail_url?: string
          category_id?: string
          slug?: string
          difficulty_level?: string
          age_group?: string
          is_featured?: boolean
          download_count?: number
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      // Add other tables as needed
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
  }
}

export type Category = Database["public"]["Tables"]["categories"]["Row"]
