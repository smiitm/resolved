'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Loading03Icon } from '@hugeicons/core-free-icons'
import { useRouter } from 'next/navigation'

interface FollowButtonProps {
    targetUserId: string
    isFollowing: boolean
    isLoggedIn: boolean
}

export function FollowButton({ targetUserId, isFollowing: initialIsFollowing, isLoggedIn }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleFollow = async () => {
        if (!isLoggedIn) {
            // Redirect to home/login if not logged in
            router.push('/')
            return
        }

        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/')
                return
            }

            if (isFollowing) {
                // Unfollow
                const { error } = await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', user.id)
                    .eq('following_id', targetUserId)

                if (!error) {
                    setIsFollowing(false)
                }
            } else {
                // Follow
                const { error } = await supabase
                    .from('follows')
                    .insert({
                        follower_id: user.id,
                        following_id: targetUserId
                    })

                if (!error) {
                    setIsFollowing(true)
                }
            }

            // Refresh to update follower count
            router.refresh()
        } catch (error) {
            console.error('Follow error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant={isFollowing ? "outline" : "default"}
            onClick={handleFollow}
            disabled={loading}
        >
            {loading ? (
                <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="animate-spin" />
            ) : (
                isFollowing ? 'Following' : 'Follow'
            )}
        </Button>
    )
}
