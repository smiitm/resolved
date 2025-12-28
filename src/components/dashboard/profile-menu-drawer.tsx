'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    Menu01Icon,
    UserGroupIcon,
    Logout01Icon,
    Sun03Icon,
    Moon02Icon,
    Loading03Icon,
    ArrowRight01Icon,
    Edit02Icon,
} from '@hugeicons/core-free-icons'
import { EditProfileDialog } from './edit-profile-dialog'
import type { Profile } from './profile-header'

interface FollowingUser {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
}

interface ProfileMenuDrawerProps {
    userId: string
    profile: Profile
}

export function ProfileMenuDrawer({ userId, profile }: ProfileMenuDrawerProps) {
    const [open, setOpen] = useState(false)
    const [following, setFollowing] = useState<FollowingUser[]>([])
    const [loading, setLoading] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)
    const [mounted, setMounted] = useState(false)

    const router = useRouter()
    const supabase = createClient()
    const { resolvedTheme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch following users when drawer opens
    useEffect(() => {
        if (open && following.length === 0) {
            fetchFollowing()
        }
    }, [open, following.length])

    const fetchFollowing = async () => {
        setLoading(true)
        try {
            // Get all users that the current user is following
            const { data: followData } = await supabase
                .from('follows')
                .select('following_id')
                .eq('follower_id', userId)

            if (followData && followData.length > 0) {
                const followingIds = followData.map(f => f.following_id)

                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, username, full_name, avatar_url')
                    .in('id', followingIds)

                if (profiles) {
                    setFollowing(profiles)
                }
            }
        } catch (error) {
            console.error('Error fetching following:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoggingOut(true)
        try {
            await supabase.auth.signOut()
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
            setLoggingOut(false)
        }
    }

    const handleUserClick = (username: string) => {
        setOpen(false)
        router.push(`/${username}`)
    }

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    const isDark = mounted ? resolvedTheme === 'dark' : false

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger
                render={
                    <Button variant="outline" size="icon">
                        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
                    </Button>
                }
            />

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Menu</DrawerTitle>
                </DrawerHeader>

                <div className="flex flex-col flex-1 gap-6 mt-2">
                    {/* Friends Section */}
                    <div className="flex-1 min-h-0">
                        <div className="flex items-center gap-2 mb-3">
                            <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Following</span>
                        </div>

                        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-5 animate-spin text-muted-foreground" />
                                </div>
                            ) : following.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">
                                    You're not following anyone yet
                                </p>
                            ) : (
                                following.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleUserClick(user.username)}
                                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors group text-left"
                                    >
                                        {user.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt={user.full_name}
                                                className="size-9 rounded-full object-cover ring-1 ring-foreground/10"
                                            />
                                        ) : (
                                            <div className="size-9 rounded-full bg-muted flex items-center justify-center ring-1 ring-foreground/10">
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {user.full_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                @{user.username}
                                            </p>
                                        </div>
                                        <HugeiconsIcon
                                            icon={ArrowRight01Icon}
                                            strokeWidth={2}
                                            className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Settings Section */}
                    <div className="space-y-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                        >
                            <div className="size-9 rounded-full bg-muted/50 flex items-center justify-center">
                                <HugeiconsIcon
                                    icon={isDark ? Sun03Icon : Moon02Icon}
                                    strokeWidth={2}
                                    className="size-4 text-foreground"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                    {isDark ? 'Light Mode' : 'Dark Mode'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Switch to {isDark ? 'light' : 'dark'} theme
                                </p>
                            </div>
                        </button>

                        {/* Edit Profile */}
                        <EditProfileDialog
                            profile={profile}
                            customTrigger={
                                <button
                                    className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                                >
                                    <div className="size-9 rounded-full bg-muted/50 flex items-center justify-center">
                                        <HugeiconsIcon
                                            icon={Edit02Icon}
                                            strokeWidth={2}
                                            className="size-4 text-foreground"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Edit Profile
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Update your profile information
                                        </p>
                                    </div>
                                </button>
                            }
                        />

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-destructive/10 transition-colors text-left group"
                        >
                            <div className="size-9 rounded-full bg-destructive/10 flex items-center justify-center">
                                {loggingOut ? (
                                    <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 text-destructive animate-spin" />
                                ) : (
                                    <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="size-4 text-destructive" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-destructive">
                                    {loggingOut ? 'Signing out...' : 'Sign Out'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Log out of your account
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
