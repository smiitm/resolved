'use client'

import { HugeiconsIcon } from "@hugeicons/react"
import {
    Location01Icon,
    BriefcaseIcon,
} from "@hugeicons/core-free-icons"
import { EditProfileDialog } from "./edit-profile-dialog"
import { LogoutButton } from "@/components/auth/logout-button"

interface Profile {
    id: string
    username: string
    full_name: string
    profession: string | null
    location: string | null
    avatar_url: string | null
    bio: string | null
}

interface ProfileHeaderProps {
    profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-6">
                {/* Profile Picture */}
                <div className="shrink-0">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            className="size-20 sm:size-24 rounded-xl object-cover ring-1 ring-foreground/10"
                        />
                    ) : (
                        <div className="size-20 sm:size-24 rounded-xl bg-muted flex items-center justify-center ring-1 ring-foreground/10">
                            <span className="text-3xl sm:text-4xl font-semibold text-muted-foreground">
                                {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-serif text-foreground truncate">
                            {profile.full_name}
                        </h1>
                    </div>

                    {/* Location, Profession & Followers - Same Line */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base sm:text-lg text-muted-foreground">
                        {profile.location && (
                            <span className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={Location01Icon} strokeWidth={2} className="size-4" />
                                {profile.location}
                            </span>
                        )}
                        {profile.profession && (
                            <span className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={BriefcaseIcon} strokeWidth={2} className="size-4" />
                                {profile.profession}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                    <EditProfileDialog profile={profile} />
                    <LogoutButton />
                </div>
            </div>

            {/* Bio - Below avatar for left alignment */}
            {profile.bio && (
                <p className="text-base sm:text-lg text-foreground/80">
                    {profile.bio}
                </p>
            )}
        </div>
    )
}

export type { Profile }
