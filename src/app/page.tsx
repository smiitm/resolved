import { LoginButton } from "@/components/auth/login-button"

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 rounded-xl border border-border bg-card p-8 shadow-lg">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome to Resolved
                    </h1>
                    <p className="text-muted-foreground">
                        Sign in to access your dashboard
                    </p>
                </div>

                <LoginButton />
            </div>
        </div>
    )
}