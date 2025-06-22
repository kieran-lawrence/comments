import * as React from 'react'
import { cn } from './lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card"
            className={cn(
                'text-text-primary flex flex-col gap-6 rounded-xl border border-black/25 p-4 shadow-sm',
                className,
            )}
            {...props}
        />
    )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start has-data-[slot=card-action]:grid-cols-[1fr_auto]',
                className,
            )}
            {...props}
        />
    )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-title"
            className={cn('textTitleItemMd text-text-primary', className)}
            {...props}
        />
    )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="card-content" className={className} {...props} />
}

export { Card, CardHeader, CardTitle, CardContent }
