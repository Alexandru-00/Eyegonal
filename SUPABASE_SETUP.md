# Configurazione Supabase per Eyegonal

## 1. Crea un progetto Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un account
2. Crea un nuovo progetto
3. Aspetta che il progetto sia pronto

## 2. Configura le variabili d'ambiente

Dopo aver creato il progetto, copia l'URL e la chiave anonima dalla dashboard:

1. Vai su Settings > API
2. Copia l'URL del progetto
3. Copia la anon/public key

Modifica il file `.env` nella root del progetto:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Esegui lo schema del database

1. Nella dashboard Supabase, vai su SQL Editor
2. Copia e incolla il contenuto del file `supabase-schema.sql`
3. Esegui lo script

## 4. Credenziali admin di default

- Email: `admin@eyegonal.com`
- Password: `admin123`

**IMPORTANTE**: Cambia la password dopo il primo login!

## 5. Avvia l'applicazione

```bash
npm run dev
```

Le pagine admin saranno disponibili su:
- Login: `/admin/login`
- Dashboard: `/admin/dashboard`

## Note di sicurezza

- In produzione, assicurati di abilitare l'autenticazione email di Supabase
- Usa password sicure per gli admin
- Considera di aggiungere rate limiting per i tentativi di login
- Monitora i log di Supabase per attività sospette