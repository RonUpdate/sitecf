export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          image_url?: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          slug?: string
          created_at?: string
        }
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
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}

export type Category = Database["public"]["Tables"]["categories"]["Row"]
