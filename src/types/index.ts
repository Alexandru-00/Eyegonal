export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: 'tshirt' | 'hoodie' | 'accessories'
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
  last_login: string | null
}

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}

export interface CollectionItem {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
}
