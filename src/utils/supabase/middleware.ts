import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected route - redirect to landing page if not authenticated
    if (!user && request.nextUrl.pathname === '/onboarding') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // Redirect old users (with profile) away from onboarding to their profile
    if (user && request.nextUrl.pathname === '/onboarding') {
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single()

        if (profile) {
            const url = request.nextUrl.clone()
            url.pathname = `/${profile.username}`
            return NextResponse.redirect(url)
        }
    }

    // If user is logged in and tries to access landing page, redirect to their profile
    if (user && request.nextUrl.pathname === '/') {
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single()

        if (profile) {
            const url = request.nextUrl.clone()
            url.pathname = `/${profile.username}`
            return NextResponse.redirect(url)
        }
        // If no profile, let them go to landing page (they'll need to onboard)
    }

    return supabaseResponse
}

