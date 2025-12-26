import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (code) {
        const supabase = await createClient()
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && session?.user) {
            // 1. Check if the user has a profile in your database
            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', session.user.id)
                .single()
            
            // 2. Decide where to send them
            if (profile) {
                // User exists -> Go to Dashboard
                return NextResponse.redirect(`${origin}/dashboard`)
            } else {
                // New user -> Go to Onboarding to pick a username
                return NextResponse.redirect(`${origin}/onboarding`)
            }
        }
    }

    // Return the user to an error page with instructions if auth fails
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}