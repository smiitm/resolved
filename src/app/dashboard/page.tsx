import { createClient } from "@/utils/supabase/server"
import { LogoutButton } from "@/components/auth/logout-button"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        {user?.email}
                    </span>
                    <LogoutButton />
                </div>
            </header>

            <main className="flex flex-1 flex-col gap-6 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="text-lg font-semibold text-foreground">Card 1</h3>
                        <p className="mt-2 text-muted-foreground">Dashboard content goes here</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="text-lg font-semibold text-foreground">Card 2</h3>
                        <p className="mt-2 text-muted-foreground">Dashboard content goes here</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="text-lg font-semibold text-foreground">Card 3</h3>
                        <p className="mt-2 text-muted-foreground">Dashboard content goes here</p>
                    </div>
                </div>

                <a
                    href="/home"
                    className="text-primary underline hover:no-underline"
                >
                    ← Back to Home
                </a>
            </main>
        </div>
    )
}
