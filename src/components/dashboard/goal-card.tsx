'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/utils/supabase/client'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    ArrowDown01Icon,
    ArrowUp01Icon,
    Delete02Icon,
    CheckmarkSquare01Icon,
    SquareIcon,
    Add01Icon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import type { Goal, SubGoal } from './goals-section'

interface GoalCardProps {
    goal: Goal
    isOwner: boolean
    canEdit: boolean
    canAddSubGoal: boolean
    onGoalDeleted: (goalId: string) => void
    onGoalUpdated: (goal: Goal) => void
    onSubGoalAdded: (goalId: string, subGoal: SubGoal) => void
    onSubGoalToggled: (goalId: string, subGoalId: string, isCompleted: boolean) => void
    onSubGoalDeleted: (goalId: string, subGoalId: string) => void
}

export function GoalCard({
    goal,
    isOwner,
    canEdit,
    canAddSubGoal,
    onGoalDeleted,
    onGoalUpdated,
    onSubGoalAdded,
    onSubGoalToggled,
    onSubGoalDeleted,
}: GoalCardProps) {
    const supabase = createClient()
    const [expanded, setExpanded] = useState(false)
    const [newSubGoalTitle, setNewSubGoalTitle] = useState('')
    const [addingSubGoal, setAddingSubGoal] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const completedCount = goal.sub_goals.filter(sg => sg.is_completed).length
    const totalCount = goal.sub_goals.length
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    // Goal is considered complete if explicitly marked OR all sub-goals are done (when there are sub-goals)
    const isGoalComplete = goal.is_completed || (totalCount > 0 && completedCount === totalCount)

    // Check if goal has been edited (last_edited is different from created_at)
    const isEdited = goal.last_edited && goal.last_edited !== goal.created_at

    const handleToggleGoal = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isOwner) return

        const newValue = !goal.is_completed
        // Optimistic update
        onGoalUpdated({ ...goal, is_completed: newValue })

        try {
            const { error } = await supabase
                .from('goals')
                .update({ is_completed: newValue })
                .eq('id', goal.id)

            if (error) throw error
        } catch (error) {
            console.error('Error toggling goal:', error)
            // Revert on error
            onGoalUpdated({ ...goal, is_completed: !newValue })
        }
    }

    const handleDeleteGoal = async () => {
        if (!confirm('Delete this goal and all its sub-goals?')) return
        setDeleting(true)

        try {
            const { error } = await supabase
                .from('goals')
                .delete()
                .eq('id', goal.id)

            if (error) throw error
            onGoalDeleted(goal.id)
        } catch (error) {
            console.error('Error deleting goal:', error)
            alert('Failed to delete goal')
        } finally {
            setDeleting(false)
        }
    }

    const handleAddSubGoal = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSubGoalTitle.trim()) return
        setAddingSubGoal(true)

        try {
            const { data, error } = await supabase
                .from('sub_goals')
                .insert({
                    goal_id: goal.id,
                    title: newSubGoalTitle.trim(),
                })
                .select()
                .single()

            if (error) throw error
            onSubGoalAdded(goal.id, data as SubGoal)
            setNewSubGoalTitle('')
        } catch (error) {
            console.error('Error adding sub-goal:', error)
            alert('Failed to add sub-goal')
        } finally {
            setAddingSubGoal(false)
        }
    }

    const handleToggleSubGoal = async (subGoal: SubGoal) => {
        const newValue = !subGoal.is_completed
        // Optimistic update
        onSubGoalToggled(goal.id, subGoal.id, newValue)

        try {
            const { error } = await supabase
                .from('sub_goals')
                .update({ is_completed: newValue })
                .eq('id', subGoal.id)

            if (error) throw error
        } catch (error) {
            console.error('Error toggling sub-goal:', error)
            // Revert on error
            onSubGoalToggled(goal.id, subGoal.id, !newValue)
        }
    }

    const handleDeleteSubGoal = async (subGoalId: string) => {
        try {
            const { error } = await supabase
                .from('sub_goals')
                .delete()
                .eq('id', subGoalId)

            if (error) throw error
            onSubGoalDeleted(goal.id, subGoalId)
        } catch (error) {
            console.error('Error deleting sub-goal:', error)
            alert('Failed to delete sub-goal')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ boxShadow: isGoalComplete ? '0 0 20px rgba(124, 58, 237, 0.15)' : '0 0 20px rgba(124, 58, 237, 0.08)' }}
            className={`rounded-lg sm:rounded-xl border overflow-hidden transition-colors ${isGoalComplete ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-card'}`}
        >
            {/* Goal Header */}
            <div
                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Goal Completion Checkbox */}
                <button
                    onClick={handleToggleGoal}
                    disabled={!isOwner}
                    className={`shrink-0 ${isOwner ? 'cursor-pointer' : 'cursor-default'}`}
                >
                    <HugeiconsIcon
                        icon={isGoalComplete ? CheckmarkSquare01Icon : SquareIcon}
                        strokeWidth={2}
                        className={`size-5 sm:size-6 ${isGoalComplete ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                </button>

                {/* Goal Title & Progress */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <h3 className={`text-sm sm:text-base font-medium truncate ${isGoalComplete ? 'text-primary' : 'text-foreground'}`}>
                            {goal.title}
                        </h3>
                        {isEdited && (
                            <span className="shrink-0 text-[9px] sm:text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 sm:px-1.5 py-0.5 rounded">
                                edited
                            </span>
                        )}
                    </div>
                    {totalCount > 0 && (
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                            <div className="flex-1 h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden max-w-24 sm:max-w-32">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                                {completedCount}/{totalCount}
                            </span>
                        </div>
                    )}
                </div>

                {/* Expand Arrow */}
                <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                    <HugeiconsIcon
                        icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
                        strokeWidth={2}
                        className="size-3.5 sm:size-4"
                    />
                </button>

                {/* Delete Button (Owner only, during edit windows) */}
                {isOwner && canEdit && (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteGoal()
                        }}
                        disabled={deleting}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4" />
                    </Button>
                )}
            </div>

            {/* Expanded Sub-Goals */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-border/50 bg-muted/20">
                            {/* Sub-goals list */}
                            {goal.sub_goals.length > 0 ? (
                                <ul className="divide-y divide-border/30">
                                    {goal.sub_goals.map(subGoal => (
                                        <li
                                            key={subGoal.id}
                                            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 group"
                                        >
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => isOwner && handleToggleSubGoal(subGoal)}
                                                disabled={!isOwner}
                                                className={`shrink-0 ${isOwner ? 'cursor-pointer' : 'cursor-default'}`}
                                            >
                                                <HugeiconsIcon
                                                    icon={subGoal.is_completed ? CheckmarkSquare01Icon : SquareIcon}
                                                    strokeWidth={2}
                                                    className={`size-4 sm:size-5 ${subGoal.is_completed ? 'text-primary' : 'text-muted-foreground'}`}
                                                />
                                            </button>

                                            {/* Sub-goal title */}
                                            <span className={`flex-1 text-xs sm:text-sm ${subGoal.is_completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                                {subGoal.title}
                                            </span>

                                            {/* Delete sub-goal (Owner only, during edit windows) */}
                                            {isOwner && canEdit && (
                                                <button
                                                    onClick={() => handleDeleteSubGoal(subGoal.id)}
                                                    className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                                                >
                                                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-3.5 sm:size-4" />
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-muted-foreground">
                                    No sub-goals yet.
                                </p>
                            )}

                            {/* Add Sub-goal Input (Owner only, during edit windows) */}
                            {isOwner && canEdit && canAddSubGoal && (
                                <form
                                    onSubmit={handleAddSubGoal}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-border/30"
                                >
                                    <input
                                        type="text"
                                        value={newSubGoalTitle}
                                        onChange={e => setNewSubGoalTitle(e.target.value)}
                                        placeholder="Add a sub-goal..."
                                        maxLength={100}
                                        className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                    />
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="icon-sm"
                                        disabled={!newSubGoalTitle.trim() || addingSubGoal}
                                    >
                                        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3.5 sm:size-4" />
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
