import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { ProfileHeader, type Profile } from "@/components/dashboard/profile-header"
import { GoalsSection, type Goal } from "@/components/dashboard/goals-section"

interface PageProps {
    params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
    const { username } = await params
    const supabase = await createClient()

    // Get current logged-in user
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch the profile by username
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single() as { data: Profile | null }

    // If profile doesn't exist, show 404
    if (!profile) {
        notFound()
    }

    // Check if logged-in user is viewing their own profile
    const isOwner = user?.id === profile.id
    const isLoggedIn = !!user

    // Check if logged-in user is following this profile
    let isFollowing = false
    if (user && !isOwner) {
        const { data: followRecord } = await supabase
            .from('follows')
            .select('follower_id')
            .eq('follower_id', user.id)
            .eq('following_id', profile.id)
            .single()

        isFollowing = !!followRecord
    }

    // Fetch goals with sub_goals for this profile
    // For non-owners, only fetch public goals
    const goalsQuery = supabase
        .from('goals')
        .select('*, sub_goals(*)')
        .eq('user_id', profile.id)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true })

    if (!isOwner) {
        goalsQuery.eq('is_public', true)
    }

    const { data: goals } = await goalsQuery as { data: Goal[] | null }

    return (
        <div className="min-h-screen pt-8 sm:pt-24">
            <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">
                <ProfileHeader
                    profile={profile}
                    isOwner={isOwner}
                    isFollowing={isFollowing}
                    isLoggedIn={isLoggedIn}
                />

                <GoalsSection
                    goals={goals || []}
                    userId={profile.id}
                    isOwner={isOwner}
                />
            </div>
        </div>
    )
}
