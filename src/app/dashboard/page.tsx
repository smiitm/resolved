import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ProfileHeader, type Profile } from "@/components/dashboard/profile-header"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single() as { data: Profile | null }

    if (!profile) {
        redirect('/onboarding')
    }

    return (
        <div className="min-h-screen pt-8 sm:pt-24">
            <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                <ProfileHeader profile={profile} />

                {/* Goals Section - Placeholder */}

            </div>
        </div>
    )
}
