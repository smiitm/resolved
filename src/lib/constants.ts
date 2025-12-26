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

// ============================================
// Edit Windows - Quarterly Review System
// ============================================

export type EditWindow = 'resolution' | 'q1_review' | 'q2_review' | 'q3_review' | null

interface EditWindowInfo {
    name: string
    shortName: string
    isResolutionWindow: boolean // Dec/Jan = drafting phase, not flagged as "edited"
}

const EDIT_WINDOW_INFO: Record<Exclude<EditWindow, null>, EditWindowInfo> = {
    resolution: { name: 'Resolution Window', shortName: 'Resolution', isResolutionWindow: true },
    q1_review: { name: 'Q1 Review', shortName: 'Q1', isResolutionWindow: false },
    q2_review: { name: 'Q2 Review', shortName: 'Q2', isResolutionWindow: false },
    q3_review: { name: 'Q3 Review', shortName: 'Q3', isResolutionWindow: false },
}

/**
 * Check which edit window is currently active based on date
 * @param date - Date to check (defaults to now)
 * @returns The active edit window or null if outside all windows
 */
export function getCurrentEditWindow(date: Date = new Date()): EditWindow {
    const month = date.getMonth() + 1 // 1-12
    const day = date.getDate()

    // Resolution Window: Dec 25 - Jan 3
    if ((month === 12 && day >= 25) || (month === 1 && day <= 3)) {
        return 'resolution'
    }

    // Q1 Review: Apr 1-3
    if (month === 4 && day >= 1 && day <= 3) {
        return 'q1_review'
    }

    // Q2 Review: Jul 1-3
    if (month === 7 && day >= 1 && day <= 3) {
        return 'q2_review'
    }

    // Q3 Review: Oct 1-3
    if (month === 10 && day >= 1 && day <= 3) {
        return 'q3_review'
    }

    return null
}

/**
 * Check if structural changes (add/delete/rename) are allowed right now
 */
export function canMakeStructuralChanges(date: Date = new Date()): boolean {
    return getCurrentEditWindow(date) !== null
}

/**
 * Get info about an edit window
 */
export function getEditWindowInfo(window: EditWindow): EditWindowInfo | null {
    if (!window) return null
    return EDIT_WINDOW_INFO[window]
}

/**
 * Get the next edit window date range for display
 */
export function getNextEditWindow(date: Date = new Date()): { name: string; startDate: string } {
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    // Determine next window based on current date
    if (month >= 1 && month < 4) {
        return { name: 'Q1 Review', startDate: `April 1, ${year}` }
    } else if (month >= 4 && month < 7) {
        return { name: 'Q2 Review', startDate: `July 1, ${year}` }
    } else if (month >= 7 && month < 10) {
        return { name: 'Q3 Review', startDate: `October 1, ${year}` }
    } else {
        return { name: 'Resolution Window', startDate: `December 25, ${year}` }
    }
}
