// Reserved usernames that cannot be claimed by users
// These correspond to existing routes and system paths
export const RESERVED_USERNAMES = [
    'auth',
    'callback',
    'onboarding',
    'api',
    'home',
    '_next',
    'static',
    'favicon',
    'login',
    'logout',
    'settings',
    'admin',
    'dashboard',
] as const

export type ReservedUsername = typeof RESERVED_USERNAMES[number]

export function isReservedUsername(username: string): boolean {
    return RESERVED_USERNAMES.includes(username.toLowerCase() as ReservedUsername)
}
