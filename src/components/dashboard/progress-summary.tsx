'use client'

import { motion } from 'motion/react'

interface ProgressSummaryProps {
    totalGoals: number
    completedGoals: number
    totalSubGoals: number
    completedSubGoals: number
}

export function ProgressSummary({
    totalGoals,
    completedGoals,
    totalSubGoals,
    completedSubGoals,
}: ProgressSummaryProps) {
    const goalProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
    const subGoalProgress = totalSubGoals > 0 ? (completedSubGoals / totalSubGoals) * 100 : 0

    // Overall progress is weighted average (goals count more)
    const overallProgress = totalGoals > 0
        ? (goalProgress * 0.4 + subGoalProgress * 0.6)
        : 0

    if (totalGoals === 0) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border/50 bg-muted/30 p-3 sm:p-4"
        >
            <div className="flex items-center justify-between gap-4">
                {/* Progress bar section */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs sm:text-sm font-medium text-foreground">
                            Progress
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-primary">
                            {Math.round(overallProgress)}%
                        </span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${overallProgress}%` }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground shrink-0">
                    <span>
                        <span className="font-medium text-foreground">{completedGoals}</span>/{totalGoals}
                    </span>
                    <span>
                        <span className="font-medium text-foreground">{completedSubGoals}</span>/{totalSubGoals}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}
