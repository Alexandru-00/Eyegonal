import { supabase } from '@/supabase'
import type { Product, ProductWithCategory } from '@/types'

export class ProductService {
  static async getAll(): Promise<{ data: ProductWithCategory[] | null, error: any }> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false })

    return { data, error }
  }

  static async getById(id: string): Promise<{ data: ProductWithCategory | null, error: any }> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single()

    return { data, error }
  }

  static async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ProductWithCategory | null, error: any }> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    return { data, error }
  }

  static async update(id: string, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: ProductWithCategory | null, error: any }> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    return { data, error }
  }

  static async delete(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    return { error }
  }

  static async getByCategory(categoryId: string): Promise<{ data: ProductWithCategory[] | null, error: any }> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    return { data, error }
  }
}