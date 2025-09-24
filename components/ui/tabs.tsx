'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-10 w-full items-center justify-center rounded-lg p-[3px] shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
        "text-foreground data-[state=inactive]:hover:bg-white data-[state=inactive]:hover:text-foreground/90",
        // Active state: AgriGoo green
        "data-[state=active]:bg-[#22c55e] data-[state=active]:text-white data-[state=active]:font-semibold",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",
        // Focus ring
        "focus-visible:outline-1 focus-visible:outline-[#22c55e] focus-visible:ring-[3px] focus-visible:ring-[#22c55e]/30",
        // Icons inside
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'flex-1 outline-none',
        // Smooth slide/fade transitions using tailwindcss-animate
        'data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:slide-in-from-right-2',
        'data-[state=inactive]:animate-out data-[state=inactive]:fade-out data-[state=inactive]:slide-out-to-left-2',
        className,
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
