const ADMIN_SESSION_KEY = 'eyegonal_admin_session'

export function getAdminSessionToken(): string | null {
  try {
    const s = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!s) return null
    const data = JSON.parse(s)
    return data?.sessionToken ?? null
  } catch {
    return null
  }
}
