'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    UserIcon,
    Location01Icon,
    BriefcaseIcon,
    Link01Icon,
    ArrowRight01Icon,
    Loading03Icon,
    TextIcon,
} from '@hugeicons/core-free-icons'
import { Textarea } from '@/components/ui/textarea'
import { isReservedUsername } from '@/lib/constants'

export default function OnboardingPage() {
    const supabase = createClient()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        profession: '',
        location: '',
        bio: '',
        social_link: ''
    })

    // Prefill data from Google Account
    useEffect(() => {
        const getGoogleData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    full_name: user.user_metadata.full_name || '',
                    username: user.user_metadata.full_name?.replace(/\s/g, '').toLowerCase().slice(0, 15) || ''
                }))
            }
        }
        getGoogleData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No authenticated user found')

            // Check if username is reserved
            if (isReservedUsername(formData.username)) {
                alert('This username is reserved. Please choose a different one.')
                setLoading(false)
                return
            }

            const { data: existing } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', formData.username)
                .single()

            if (existing) {
                alert('This username is already taken.')
                setLoading(false)
                return
            }

            const { error } = await supabase.from('profiles').insert({
                id: user.id,
                username: formData.username,
                full_name: formData.full_name,
                profession: formData.profession || null,
                location: formData.location || null,
                bio: formData.bio || null,
                social_link: formData.social_link || null,
                avatar_url: user.user_metadata.avatar_url,
            })

            if (error) throw error

            router.push(`/${formData.username}`)
            router.refresh()

        } catch (error) {
            console.error(error)
            alert('Error creating profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl">Claim your URL</CardTitle>
                    <CardDescription>
                        Choose a unique username for your public profile.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="onboarding-form" onSubmit={handleSubmit}>
                        <FieldGroup>
                            {/* Username Field */}
                            <Field>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon align="inline-start">
                                        <HugeiconsIcon icon={Link01Icon} strokeWidth={2} className="size-4 text-primary" />
                                        <span>resolved.app/</span>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="username"
                                        required
                                        maxLength={20}
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                                        placeholder="yourname"
                                    />
                                </InputGroup>
                                <FieldDescription>
                                    Only lowercase letters, numbers, and underscores.
                                </FieldDescription>
                            </Field>

                            {/* Display Name Field */}
                            <Field>
                                <FieldLabel htmlFor="fullname">Display Name</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon align="inline-start">
                                        <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4 text-primary" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="fullname"
                                        required
                                        maxLength={50}
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Your full name"
                                    />
                                </InputGroup>
                            </Field>

                            {/* Optional Fields Section */}
                            <div className="pt-2 border-t border-border/50">
                                <p className="text-xs text-muted-foreground mb-3">Optional — you can always add these later</p>

                                {/* Bio Field */}
                                <Field>
                                    <FieldLabel htmlFor="bio" className="text-muted-foreground">Bio</FieldLabel>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell people about yourself..."
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        rows={2}
                                        maxLength={160}
                                    />
                                </Field>
                            </div>

                            {/* Profession, Location, Social Link - Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="profession" className="text-muted-foreground">Profession</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align="inline-start">
                                            <HugeiconsIcon icon={BriefcaseIcon} strokeWidth={2} className="size-4 text-muted-foreground" />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="profession"
                                            placeholder="Developer"
                                            value={formData.profession}
                                            onChange={e => setFormData({ ...formData, profession: e.target.value })}
                                        />
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="location" className="text-muted-foreground">Location</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon align="inline-start">
                                            <HugeiconsIcon icon={Location01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="location"
                                            placeholder="Mumbai"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </InputGroup>
                                </Field>
                            </div>

                            {/* Social Link Field */}
                            <Field>
                                <FieldLabel htmlFor="social_link" className="text-muted-foreground">Social Link</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon align="inline-start">
                                        <HugeiconsIcon icon={Link01Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="social_link"
                                        placeholder="x.com/you"
                                        value={formData.social_link}
                                        onChange={e => setFormData({ ...formData, social_link: e.target.value })}
                                    />
                                </InputGroup>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        form="onboarding-form"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="animate-spin" data-icon="inline-start" />
                                Creating Profile...
                            </>
                        ) : (
                            <>
                                Start 2026
                                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-end" />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}