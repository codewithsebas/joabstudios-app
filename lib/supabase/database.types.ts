/**
 * Hand-written to match supabase/migrations/20261123012210_leads_crm.sql.
 * Regenerate with `supabase gen types typescript` once the project is linked.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'negotiation' | 'won' | 'lost'
export type LeadSource = 'quote' | 'contact'
export type LeadEventType = 'created' | 'status_changed' | 'note' | 'follow_up_set' | 'quote_value_set'

export type LeadRow = {
  id: string
  created_at: string
  updated_at: string
  source: LeadSource
  status: LeadStatus
  accommodation_type: string | null
  services: string[]
  business_name: string | null
  location: string | null
  website: string | null
  units: number | null
  full_name: string
  email: string
  whatsapp: string | null
  budget: string | null
  message: string | null
  follow_up_date: string | null
  quote_value: number | null
  quote_currency: string
  ip_hash: string | null
  user_agent: string | null
}

export type LeadInsert = {
  source: LeadSource
  full_name: string
  email: string
  accommodation_type?: string | null
  services?: string[]
  business_name?: string | null
  location?: string | null
  website?: string | null
  units?: number | null
  whatsapp?: string | null
  budget?: string | null
  message?: string | null
  ip_hash?: string | null
  user_agent?: string | null
}

export type LeadUpdate = {
  status?: LeadStatus
  follow_up_date?: string | null
  quote_value?: number | null
  quote_currency?: string
}

export type LeadEventRow = {
  id: string
  lead_id: string
  created_at: string
  actor_id: string | null
  type: LeadEventType
  from_status: LeadStatus | null
  to_status: LeadStatus | null
  body: string | null
  metadata: Json
}

export type LeadEventInsert = {
  lead_id: string
  actor_id: string
  type: 'note'
  body: string
}

export type AdminUserRow = {
  user_id: string
  role: 'admin' | 'sales'
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow
        Insert: LeadInsert
        Update: LeadUpdate
        Relationships: []
      }
      lead_events: {
        Row: LeadEventRow
        Insert: LeadEventInsert
        Update: Record<string, never>
        Relationships: [
          {
            foreignKeyName: 'lead_events_lead_id_fkey'
            columns: ['lead_id']
            isOneToOne: false
            referencedRelation: 'leads'
            referencedColumns: ['id']
          },
        ]
      }
      admin_users: {
        Row: AdminUserRow
        Insert: Record<string, never>
        Update: Record<string, never>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      lead_status: LeadStatus
      lead_source: LeadSource
      lead_event_type: LeadEventType
    }
    CompositeTypes: { [_ in never]: never }
  }
}
