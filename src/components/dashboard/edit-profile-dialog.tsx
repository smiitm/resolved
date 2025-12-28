'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    UserIcon,
    Location01Icon,
    BriefcaseIcon,
    Link01Icon,
    Loading03Icon,
    CheckmarkCircle02Icon,
    Edit02Icon,
} from '@hugeicons/core-free-icons'
import type { Profile } from './profile-header'
import { toast } from 'sonner'

interface EditProfileDialogProps {
    profile: Profile
    customTrigger?: React.ReactElement
}

export function EditProfileDialog({ profile, customTrigger }: EditProfileDialogProps) {
    const supabase = createClient()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        username: profile.username || '',
        full_name: profile.full_name || '',
        profession: profile.profession || '',
        location: profile.location || '',
        bio: profile.bio || '',
        social_link: profile.social_link || ''
    })

    // Reset form when dialog opens
    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setFormData({
                username: profile.username || '',
                full_name: profile.full_name || '',
                profession: profile.profession || '',
                location: profile.location || '',
                bio: profile.bio || '',
                social_link: profile.social_link || ''
            })
        }
        setOpen(isOpen)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No authenticated user found')

            // Check if username is taken by another user
            const { data: existing } = await supabase
                .from('profiles')
                .select('id, username')
                .eq('username', formData.username)
                .single()

            if (existing && existing.id !== user.id) {
                toast.error('This username is already taken.')
                setSaving(false)
                return
            }

            // Update profile
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: formData.username,
                    full_name: formData.full_name,
                    profession: formData.profession || null,
                    location: formData.location || null,
                    bio: formData.bio || null,
                    social_link: formData.social_link || null,
                })
                .eq('id', user.id)

            if (error) throw error

            setOpen(false)
            router.refresh()

        } catch (error) {
            console.error(error)
            toast.error('Error updating profile. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
                render={
                    customTrigger || (
                        <Button variant="outline" size="sm">
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} data-icon="inline-start" />
                            Edit Profile
                        </Button>
                    )
                }
            />

            <DialogContent className="max-w-lg" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information.
                    </DialogDescription>
                </DialogHeader>

                <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        {/* Username Field */}
                        <Field>
                            <FieldLabel htmlFor="edit-username">Username</FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <HugeiconsIcon icon={Link01Icon} strokeWidth={2} className="size-4 text-primary" />
                                    <span>resolved.app/</span>
                                </InputGroupAddon>
                                <InputGroupInput
                                    id="edit-username"
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
                            <FieldLabel htmlFor="edit-fullname">Display Name</FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4 text-primary" />
                                </InputGroupAddon>
                                <InputGroupInput
                                    id="edit-fullname"
                                    required
                                    maxLength={50}
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Your full name"
                                />
                            </InputGroup>
                        </Field>

                        {/* Profession and Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="edit-profession">Profession</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon align="inline-start">
                                        <HugeiconsIcon icon={BriefcaseIcon} strokeWidth={2} className="size-4 text-primary" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="edit-profession"
                                        placeholder="Designer"
                                        value={formData.profession}
                                        onChange={e => setFormData({ ...formData, profession: e.target.value })}
                                    />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="edit-location">Location</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon align="inline-start">
                                        <HugeiconsIcon icon={Location01Icon} strokeWidth={2} className="size-4 text-primary" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="edit-location"
                                        placeholder="NYC"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </InputGroup>
                            </Field>
                        </div>

                        {/* Bio Field */}
                        <Field>
                            <FieldLabel htmlFor="edit-bio">Bio</FieldLabel>
                            <Textarea
                                id="edit-bio"
                                placeholder="Tell people a little about yourself..."
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                rows={3}
                                maxLength={160}
                            />
                            <FieldDescription>
                                Brief description for your profile.
                            </FieldDescription>
                        </Field>

                        {/* Social Link Field */}
                        <Field>
                            <FieldLabel htmlFor="edit-social-link">Social Link</FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <HugeiconsIcon icon={Link01Icon} strokeWidth={2} className="size-4 text-primary" />
                                </InputGroupAddon>
                                <InputGroupInput
                                    id="edit-social-link"
                                    placeholder="x.com/you"
                                    value={formData.social_link}
                                    onChange={e => setFormData({ ...formData, social_link: e.target.value })}
                                />
                            </InputGroup>
                            <FieldDescription>
                                Link to your social profile (Twitter, LinkedIn, etc.)
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <Button
                        variant="outline"
                        disabled={saving}
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-profile-form"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="animate-spin" data-icon="inline-start" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} data-icon="inline-start" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
