'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
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
import { Input } from '@/components/ui/input'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    Add01Icon,
    Loading03Icon,
    CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons'
import type { Goal } from './goals-section'

interface AddGoalDialogProps {
    userId: string
    onGoalAdded: (goal: Goal) => void
}

export function AddGoalDialog({ userId, onGoalAdded }: AddGoalDialogProps) {
    const supabase = createClient()
    const [open, setOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [title, setTitle] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        setSaving(true)

        try {
            const { data, error } = await supabase
                .from('goals')
                .insert({
                    user_id: userId,
                    title: title.trim(),
                    is_public: true,
                    is_completed: false,
                })
                .select()
                .single()

            if (error) throw error

            // Add empty sub_goals array to match Goal type
            const newGoal: Goal = {
                ...data,
                is_completed: data.is_completed ?? false,
                last_edited: data.last_edited ?? data.created_at,
                sub_goals: []
            }

            onGoalAdded(newGoal)
            setTitle('')
            setOpen(false)
        } catch (error) {
            console.error('Error adding goal:', error)
            alert('Failed to add goal')
        } finally {
            setSaving(false)
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setTitle('')
        }
        setOpen(isOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
                render={
                    <Button variant="outline" size="sm">
                        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
                        Add Goal
                    </Button>
                }
            />

            <DialogContent className="max-w-sm" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                    <DialogDescription>
                        What do you want to achieve in 2025?
                    </DialogDescription>
                </DialogHeader>

                <form id="add-goal-form" onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="goal-title">Goal</FieldLabel>
                            <Input
                                id="goal-title"
                                required
                                maxLength={100}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Learn a new language"
                                autoFocus
                            />
                            <FieldDescription>
                                Keep it concise and actionable.
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
                        form="add-goal-form"
                        disabled={saving || !title.trim()}
                    >
                        {saving ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="animate-spin" data-icon="inline-start" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} data-icon="inline-start" />
                                Add Goal
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
