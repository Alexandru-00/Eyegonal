import { supabase } from '@/supabase'
import { getAdminSessionToken } from '@/lib/adminSession'
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
    const token = getAdminSessionToken()
    if (!token) {
      return { data: null, error: { message: 'Sessione non valida. Effettua nuovamente il login.' } }
    }
    const { data, error } = await supabase.rpc('admin_insert_product', {
      p_session_token: token,
      p_name: product.name,
      p_price: product.price,
      p_category_id: product.category_id,
      p_image: product.image || null,
      p_description: product.description || null,
    })
    if (error) return { data: null, error }
    const err = (data as { error?: string })?.error
    if (err) return { data: null, error: { message: err } }
    return { data: data as ProductWithCategory, error: null }
  }

  static async update(id: string, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: ProductWithCategory | null, error: any }> {
    const token = getAdminSessionToken()
    if (!token) {
      return { data: null, error: { message: 'Sessione non valida. Effettua nuovamente il login.' } }
    }
    const { data, error } = await supabase.rpc('admin_update_product', {
      p_session_token: token,
      p_id: id,
      p_name: product.name!,
      p_price: product.price!,
      p_category_id: product.category_id!,
      p_image: product.image ?? null,
      p_description: product.description ?? null,
    })
    if (error) return { data: null, error }
    const err = (data as { error?: string })?.error
    if (err) return { data: null, error: { message: err } }
    return { data: data as ProductWithCategory, error: null }
  }

  static async delete(id: string): Promise<{ error: any }> {
    const token = getAdminSessionToken()
    if (!token) {
      return { error: { message: 'Sessione non valida. Effettua nuovamente il login.' } }
    }
    const { data, error } = await supabase.rpc('admin_delete_product', {
      p_session_token: token,
      p_id: id,
    })
    if (error) return { error }
    const err = (data as { error?: string })?.error
    if (err) return { error: { message: err } }
    return { error: null }
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