"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function LoginButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        setIsLoading(true)
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // User is logged in, get their username and redirect
            const { data: profile } = await supabase
                .from('users')
                .select('username')
                .eq('id', user.id)
                .single()

            if (profile?.username) {
                router.push(`/${profile.username}`)
            } else {
                router.push('/onboarding')
            }
        } else {
            // User not logged in, initiate Google OAuth
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
        }
        setIsLoading(false)
    }

    return (
        <button
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white px-5 py-2 rounded-full transition-colors disabled:opacity-50"
            onClick={handleClick}
            disabled={isLoading}
        >
            {isLoading ? "..." : "Log In"}
        </button>
    )
}

export function useAuthAction() {
    const router = useRouter()

    const handleAuthAction = async () => {
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // User is logged in, get their username and redirect
            const { data: profile } = await supabase
                .from('users')
                .select('username')
                .eq('id', user.id)
                .single()

            if (profile?.username) {
                router.push(`/${profile.username}`)
            } else {
                router.push('/onboarding')
            }
        } else {
            // User not logged in, initiate Google OAuth
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
        }
    }

    return handleAuthAction
}
