'use client'

import { useState } from 'react'
import { GoalCard } from './goal-card'
import { AddGoalDialog } from './add-goal-dialog'
import { HugeiconsIcon } from '@hugeicons/react'
import { Target01Icon, LockIcon } from '@hugeicons/core-free-icons'
import { canMakeStructuralChanges, getCurrentEditWindow, getNextEditWindow, getEditWindowInfo } from '@/lib/constants'

export interface SubGoal {
    id: string
    goal_id: string
    title: string
    is_completed: boolean
    created_at: string
}

export interface Goal {
    id: string
    user_id: string
    title: string
    is_public: boolean
    is_completed: boolean
    position: number
    created_at: string
    last_edited: string | null
    sub_goals: SubGoal[]
}

interface GoalsSectionProps {
    goals: Goal[]
    userId: string
    isOwner: boolean
}

const MAX_GOALS = 10
const MAX_SUBGOALS = 30

export function GoalsSection({ goals: initialGoals, userId, isOwner }: GoalsSectionProps) {
    const [goals, setGoals] = useState<Goal[]>(initialGoals)

    // Check edit window status
    const canEdit = canMakeStructuralChanges()
    const currentWindow = getCurrentEditWindow()
    const windowInfo = getEditWindowInfo(currentWindow)
    const nextWindow = getNextEditWindow()

    // Count total sub-goals across all goals
    const totalSubGoals = goals.reduce((acc, goal) => acc + goal.sub_goals.length, 0)

    const handleGoalAdded = (newGoal: Goal) => {
        setGoals(prev => [...prev, newGoal])
    }

    const handleGoalDeleted = (goalId: string) => {
        setGoals(prev => prev.filter(g => g.id !== goalId))
    }

    const handleGoalUpdated = (updatedGoal: Goal) => {
        setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g))
    }

    const handleSubGoalAdded = (goalId: string, newSubGoal: SubGoal) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return { ...g, sub_goals: [...g.sub_goals, newSubGoal] }
            }
            return g
        }))
    }

    const handleSubGoalToggled = (goalId: string, subGoalId: string, isCompleted: boolean) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    sub_goals: g.sub_goals.map(sg =>
                        sg.id === subGoalId ? { ...sg, is_completed: isCompleted } : sg
                    )
                }
            }
            return g
        }))
    }

    const handleSubGoalDeleted = (goalId: string, subGoalId: string) => {
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                return { ...g, sub_goals: g.sub_goals.filter(sg => sg.id !== subGoalId) }
            }
            return g
        }))
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-serif sm:text-xl text-foreground/90 flex items-center gap-1.5 sm:gap-2">
                    {/* <HugeiconsIcon icon={Target01Icon} strokeWidth={2} className="size-4 sm:size-5" /> */}
                    Goals For 2026
                </h2>
                {isOwner && canEdit && goals.length < MAX_GOALS && (
                    <AddGoalDialog
                        userId={userId}
                        onGoalAdded={handleGoalAdded}
                    />
                )}
            </div>

            {/* Edit Window Status Banner (for owners) */}
            {isOwner && (
                <div className={`text-[11px] sm:text-xs rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 flex flex-wrap items-center gap-1 sm:gap-2 ${canEdit
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-muted text-muted-foreground border border-border/50'
                    }`}>
                    {canEdit ? (
                        <>
                            <span className="font-medium">{windowInfo?.name}</span>
                            <span className="opacity-75 hidden sm:inline">— You can add, edit, and remove goals</span>
                            <span className="opacity-75 sm:hidden">— Edit mode</span>
                        </>
                    ) : (
                        <>
                            <HugeiconsIcon icon={LockIcon} strokeWidth={2} className="size-3 sm:size-3.5" />
                            <span>Locked until <span className="font-medium">{nextWindow.startDate}</span></span>
                            <span className="opacity-75 hidden sm:inline">— You can still mark progress</span>
                        </>
                    )}
                </div>
            )}

            {/* Goals List */}
            {goals.length > 0 ? (
                <div className="space-y-3">
                    {goals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            isOwner={isOwner}
                            canEdit={canEdit}
                            canAddSubGoal={totalSubGoals < MAX_SUBGOALS}
                            onGoalDeleted={handleGoalDeleted}
                            onGoalUpdated={handleGoalUpdated}
                            onSubGoalAdded={handleSubGoalAdded}
                            onSubGoalToggled={handleSubGoalToggled}
                            onSubGoalDeleted={handleSubGoalDeleted}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                    <HugeiconsIcon icon={Target01Icon} strokeWidth={1.5} className="size-10 sm:size-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                    <p className="text-xs sm:text-sm">
                        {isOwner ? "You haven't set any goals yet." : "No goals to display."}
                    </p>
                    {isOwner && canEdit && (
                        <p className="text-[11px] sm:text-xs mt-1 opacity-75">
                            Click "Add Goal" to get started
                        </p>
                    )}
                    {isOwner && !canEdit && (
                        <p className="text-[11px] sm:text-xs mt-1 opacity-75">
                            Next edit window: {nextWindow.startDate}
                        </p>
                    )}
                </div>
            )}

            {/* Limits indicator for owner */}
            {isOwner && goals.length > 0 && (
                <p className="text-[11px] sm:text-xs text-muted-foreground text-center">
                    {goals.length}/{MAX_GOALS} goals · {totalSubGoals}/{MAX_SUBGOALS} sub-goals
                </p>
            )}
        </div>
    )
}
