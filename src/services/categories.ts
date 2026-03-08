import { supabase } from '@/supabase'
import { getAdminSessionToken } from '@/lib/adminSession'
import type { Category } from '@/types'

export class CategoryService {
  static async getAll(): Promise<{ data: Category[] | null, error: any }> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    return { data, error }
  }

  static async getById(id: string): Promise<{ data: Category | null, error: any }> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    return { data, error }
  }

  static async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Category | null, error: any }> {
    const token = getAdminSessionToken()
    if (!token) {
      return { data: null, error: { message: 'Sessione non valida. Effettua nuovamente il login.' } }
    }
    const { data, error } = await supabase.rpc('admin_insert_category', {
      p_session_token: token,
      p_name: category.name,
      p_description: category.description || null,
    })
    if (error) return { data: null, error }
    const err = (data as { error?: string })?.error
    if (err) return { data: null, error: { message: err } }
    return { data: data as Category, error: null }
  }

  static async update(id: string, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: Category | null, error: any }> {
    const token = getAdminSessionToken()
    if (!token) {
      return { data: null, error: { message: 'Sessione non valida. Effettua nuovamente il login.' } }
    }
    const { data, error } = await supabase.rpc('admin_update_category', {
      p_session_token: token,
      p_id: id,
      p_name: category.name!,
      p_description: category.description ?? null,
    })
    if (error) return { data: null, error }
    const err = (data as { error?: string })?.error
    if (err) return { data: null, error: { message: err } }
    return { data: data as Category, error: null }
  }

  static async delete(id: string): Promise<{ error: any }> {
    const token = getAdminSessionToken()
    if (!token) {
      return { error: { message: 'Sessione non valida. Effettua nuovamente il login.' } }
    }
    const { data, error } = await supabase.rpc('admin_delete_category', {
      p_session_token: token,
      p_id: id,
    })
    if (error) return { error }
    const err = (data as { error?: string })?.error
    if (err) return { error: { message: err } }
    return { error: null }
  }
}