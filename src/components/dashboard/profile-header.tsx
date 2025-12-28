'use client'

import { HugeiconsIcon } from "@hugeicons/react"
import {
    Location01Icon,
    BriefcaseIcon,
    UserGroupIcon,
    Link01Icon,
    Target01Icon,
} from "@hugeicons/core-free-icons"
import { ProfileMenuDrawer } from "./profile-menu-drawer"
import { FollowButton } from "./follow-button"

interface Profile {
    id: string
    username: string
    full_name: string
    profession: string | null
    location: string | null
    avatar_url: string | null
    bio: string | null
    social_link: string | null
    follower_count?: number
    num_goals?: number
}

interface ProfileHeaderProps {
    profile: Profile
    isOwner?: boolean
    isFollowing?: boolean
    isLoggedIn?: boolean
}

export function ProfileHeader({ profile, isOwner = true, isFollowing = false, isLoggedIn = false }: ProfileHeaderProps) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Mobile: Top row with Image + Action Button */}
            {/* Desktop: Image and Info side by side */}
            <div className="flex gap-4 sm:gap-6">
                {/* Profile Picture */}
                <div className="shrink-0">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            className="size-16 sm:size-20 md:size-24 rounded-xl object-cover ring-1 ring-foreground/10"
                        />
                    ) : (
                        <div className="size-16 sm:size-20 md:size-24 rounded-xl bg-muted flex items-center justify-center ring-1 ring-foreground/10">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-muted-foreground">
                                {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Mobile: Just action button aligned top-right */}
                {/* Desktop: Full info section */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Mobile: Only show button here */}
                    <div className="sm:hidden flex justify-end">
                        {isOwner ? (
                            <ProfileMenuDrawer userId={profile.id} profile={profile} />
                        ) : (
                            <FollowButton
                                targetUserId={profile.id}
                                isFollowing={isFollowing}
                                isLoggedIn={isLoggedIn}
                            />
                        )}
                    </div>

                    {/* Desktop: Name, button, and bio */}
                    <div className="hidden sm:flex sm:flex-col sm:space-y-1 sm:flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-3xl md:text-4xl font-serif text-foreground truncate">
                                {profile.full_name}
                            </h1>
                            <div className="shrink-0">
                                {isOwner ? (
                                    <ProfileMenuDrawer userId={profile.id} profile={profile} />
                                ) : (
                                    <FollowButton
                                        targetUserId={profile.id}
                                        isFollowing={isFollowing}
                                        isLoggedIn={isLoggedIn}
                                    />
                                )}
                            </div>
                        </div>
                        {profile.bio && (
                            <p className="text-sm md:text-base text-foreground/80">
                                {profile.bio}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile only: Name below image */}
            <h1 className="sm:hidden text-2xl font-serif text-foreground truncate">
                {profile.full_name}
            </h1>

            {/* Mobile only: Bio below name */}
            {profile.bio && (
                <p className="sm:hidden text-xs text-foreground/80 line-clamp-3">
                    {profile.bio}
                </p>
            )}

            {/* Profile Info Badges - Wrap nicely on mobile */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {profile.location && (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-muted-foreground bg-muted/50 rounded-full border border-border/50">
                        <HugeiconsIcon icon={Location01Icon} strokeWidth={2} className="size-3 sm:size-3.5" />
                        {profile.location}
                    </span>
                )}
                {profile.profession && (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-muted-foreground bg-muted/50 rounded-full border border-border/50">
                        <HugeiconsIcon icon={BriefcaseIcon} strokeWidth={2} className="size-3 sm:size-3.5" />
                        {profile.profession}
                    </span>
                )}
                {(profile.num_goals !== undefined && profile.num_goals > 0) && (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-muted-foreground bg-muted/50 rounded-full border border-border/50">
                        <HugeiconsIcon icon={Target01Icon} strokeWidth={2} className="size-3 sm:size-3.5" />
                        {profile.num_goals} {profile.num_goals === 1 ? 'goal' : 'goals'}
                    </span>
                )}
                {(profile.follower_count !== undefined && profile.follower_count > 0) && (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-muted-foreground bg-muted/50 rounded-full border border-border/50">
                        <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-3 sm:size-3.5" />
                        {profile.follower_count} {profile.follower_count === 1 ? 'follower' : 'followers'}
                    </span>
                )}
                {profile.social_link && (
                    <a
                        href={profile.social_link.startsWith('http') ? profile.social_link : `https://${profile.social_link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-full border border-primary/20 transition-colors"
                    >
                        <HugeiconsIcon icon={Link01Icon} strokeWidth={2} className="size-3 sm:size-3.5" />
                        <span className="max-w-[120px] sm:max-w-none truncate">
                            {profile.social_link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                        </span>
                    </a>
                )}
            </div>
        </div>
    )
}

export type { Profile }
