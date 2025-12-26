import Link from "next/link"

export default function AuthCodeErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-border bg-card p-8 text-center shadow-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <svg
                        className="h-8 w-8 text-destructive"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        Authentication Error
                    </h1>
                    <p className="text-muted-foreground">
                        Something went wrong during the sign-in process. Please try again.
                    </p>
                </div>

                <Link
                    href="/"
                    className="text-primary underline hover:no-underline"
                >
                    Return to sign in
                </Link>
            </div>
        </div>
    )
}
