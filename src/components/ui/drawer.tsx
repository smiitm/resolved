"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

function Drawer({ ...props }: DialogPrimitive.Root.Props) {
    return <DialogPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
    return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DialogPrimitive.Portal.Props) {
    return <DialogPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DialogPrimitive.Close.Props) {
    return <DialogPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
    className,
    ...props
}: DialogPrimitive.Backdrop.Props) {
    return (
        <DialogPrimitive.Backdrop
            data-slot="drawer-overlay"
            className={cn(
                "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/20 dark:bg-black/40 duration-200 supports-backdrop-filter:backdrop-blur-sm fixed inset-0 isolate z-50",
                className
            )}
            {...props}
        />
    )
}

function DrawerContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: DialogPrimitive.Popup.Props & {
    showCloseButton?: boolean
}) {
    return (
        <DrawerPortal>
            <DrawerOverlay />
            <DialogPrimitive.Popup
                data-slot="drawer-content"
                className={cn(
                    "bg-background data-open:animate-in data-closed:animate-out data-closed:slide-out-to-right data-open:slide-in-from-right ring-foreground/10 flex flex-col gap-4 p-4 text-sm ring-1 duration-200 fixed top-0 right-0 z-50 h-full w-full max-w-[320px] sm:max-w-[360px] outline-none border-l border-border",
                    className
                )}
                {...props}
            >
                {showCloseButton && (
                    <DialogPrimitive.Close
                        data-slot="drawer-close"
                        render={
                            <Button
                                variant="ghost"
                                className="absolute top-3 right-3"
                                size="icon-sm"
                            />
                        }
                    >
                        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
                {children}
            </DialogPrimitive.Popup>
        </DrawerPortal>
    )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-header"
            className={cn("gap-1 flex flex-col pr-8", className)}
            {...props}
        />
    )
}

function DrawerTitle({ className, ...props }: DialogPrimitive.Title.Props) {
    return (
        <DialogPrimitive.Title
            data-slot="drawer-title"
            className={cn("text-base font-semibold leading-none", className)}
            {...props}
        />
    )
}

function DrawerDescription({
    className,
    ...props
}: DialogPrimitive.Description.Props) {
    return (
        <DialogPrimitive.Description
            data-slot="drawer-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    )
}

export {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerOverlay,
    DrawerPortal,
    DrawerTitle,
    DrawerTrigger,
}
