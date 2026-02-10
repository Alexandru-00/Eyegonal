import { supabase } from '@/supabase'
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
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()

    return { data, error }
  }

  static async update(id: string, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: Category | null, error: any }> {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  static async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    return { error }
  }
}