# Eyegonal - The Big EYE

> An Eye For Your Back, A Look At Loners. More Than A Brand.

Sito web vetrina per il brand di abbigliamento Eyegonal.

## Caratteristichedd

- **Design Esagonale**: Tema visivo basato sulla forma esagonale del logo
- **Tema Dark/Light**: Switch completo tra modalità chiara e scura
- **Animazioni Fluide**: Powered by Framer Motion
- **Responsive**: Ottimizzato per tutti i dispositivi
- **Modulare**: Architettura a componenti riutilizzabili
- **TypeScript**: Tipizzazione completa per maggiore robustezza

## Stack Tecnologico

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animazioni
- **React Router** - Navigazione
- **Lucide React** - Icone

## Struttura Progetto

```
src/
├── components/
│   ├── layout/        # Header, Footer, Layout
│   ├── sections/      # Hero, FeaturedProducts, etc.
│   └── ui/            # Button, Card, Hexagon, etc.
├── context/           # ThemeContext
├── hooks/             # Custom hooks
├── pages/             # Home, About, Collezione, Contatti
├── styles/            # CSS globale
└── types/             # TypeScript types
```

## Installazione

```bash
# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev

# Build per produzione
npm run build

# Preview build
npm run preview
```

## Pagine

- **/** - Homepage con hero, prodotti in evidenza, storia del brand
- **/collezione** - Catalogo prodotti con filtri
- **/about** - Storia del brand e valori
- **/contatti** - Form di contatto e FAQ

## Personalizzazione

### Colori

I colori del brand sono definiti in `tailwind.config.js`:

```js
colors: {
  eyegonal: {
    black: '#0a0a0a',
    white: '#fafafa',
    gray: { ... }
  }
}
```

### Font

Il progetto usa:
- **Inter** - Font principale
- **Orbitron** - Font display per titoli

### Prodotti

Modifica i prodotti in `src/pages/Collezione.tsx` e aggiungi le immagini in `public/images/products/`.

## Admin Login

Il login usa la tabella `admin_users` tramite RPC Supabase `verify_admin_login` (nessun CORS, massima scalabilità).

1. **Esegui la migration** in Supabase SQL Editor:  
   `supabase/migrations/0002_verify_admin_login_rpc.sql`

2. **Variabili d'ambiente** (solo frontend, già richieste per Supabase):
   - `VITE_SUPABASE_URL` – URL progetto Supabase
   - `VITE_SUPABASE_ANON_KEY` – Chiave anon (Dashboard → Settings → API)

## Link Utili

- [Instagram](https://www.instagram.com/eyegonal)
- [Vinted Shop](https://www.vinted.it/member/250232039-eyegonal)

## License

© 2026 Eyegonal. Tutti i diritti riservati.
