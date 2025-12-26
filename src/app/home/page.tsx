import { createClient } from "@/utils/supabase/server"
import { LogoutButton } from "@/components/auth/logout-button"

export default async function HomePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
                <h1 className="text-xl font-semibold text-foreground">Home</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        {user?.email}
                    </span>
                    <LogoutButton />
                </div>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                <h2 className="text-2xl font-bold text-foreground">
                    Welcome back!
                </h2>
                <p className="text-muted-foreground">
                    You are signed in as {user?.email}
                </p>
                <a
                    href="/dashboard"
                    className="mt-4 text-primary underline hover:no-underline"
                >
                    Go to Dashboard →
                </a>
            </main>
        </div>
    )
}
