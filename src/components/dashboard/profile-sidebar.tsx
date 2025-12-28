'use client'

import Link from 'next/link'
import { useAuthAction } from '@/components/auth/login-button'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

interface Profile {
    full_name: string
    avatar_url: string | null
    username: string
}

interface ProfileSidebarProps {
    profile: Profile
    isLoggedIn: boolean
    isOwner: boolean
    currentUserUsername?: string | null
}

export function ProfileSidebar({ profile, isLoggedIn, isOwner, currentUserUsername }: ProfileSidebarProps) {
    const handleAuthAction = useAuthAction()

    // Don't show sidebar if viewing own profile
    if (isOwner) return null

    return (
        <div className="hidden lg:block fixed top-24 w-[280px]" style={{ left: 'calc(50% + 400px)' }}>
            {isLoggedIn ? (
                // Logged-in user - show simple "Back to profile" button
                <Link
                    href={`/${currentUserUsername}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                    Back to your profile
                    <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
                </Link>
            ) : (
                // Non-logged-in user - show Join CTA in card
                <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-foreground">
                            Join <span className="text-primary">{profile.full_name.split(' ')[0]}</span> on Resolved!
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Join amazing folks like {profile.full_name.split(' ')[0]} and set your goals for 2026.
                        </p>
                    </div>
                    <button
                        onClick={handleAuthAction}
                        className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
                    >
                        Create account
                    </button>
                </div>
            )}
        </div>
    )
}
