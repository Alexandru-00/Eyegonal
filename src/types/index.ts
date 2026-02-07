export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: 'tshirt' | 'hoodie' | 'accessories'
  sizes: string[]
  colors: ('black' | 'white')[]
  featured?: boolean
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
