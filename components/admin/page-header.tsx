'use client';

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight, Plus } from 'lucide-react'

export type BreadCrumb = { label: string; href?: string }

export function PageHeader({
  title, description, breadcrumbs, action, secondaryAction, className,
}: {
  title: string
  description?: string
  breadcrumbs?: BreadCrumb[]
  action?: { label: string; href?: string; onClick?: () => void; icon?: any; disabled?: boolean } | React.ReactNode
  secondaryAction?: { label: string; href?: string; onClick?: () => void }
  className?: string
}) {
  const ActionIcon = (action && typeof action === 'object' && 'icon' in action) ? (action as any).icon || Plus : Plus
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {b.href ? (
                <Link href={b.href} className="hover:text-foreground">{b.label}</Link>
              ) : (
                <span>{b.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {secondaryAction && (
            secondaryAction.href ? (
              <Button variant="outline" asChild><Link href={secondaryAction.href}>{secondaryAction.label}</Link></Button>
            ) : (
              <Button variant="outline" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
            )
          )}
          {action && (
            React.isValidElement(action) ? (
              action
            ) : (
              (action as any).href ? (
                <Button asChild><Link href={(action as any).href}><ActionIcon className="h-4 w-4 mr-1" />{(action as any).label}</Link></Button>
              ) : (
                <Button onClick={(action as any).onClick} disabled={(action as any).disabled}><ActionIcon className="h-4 w-4 mr-1" />{(action as any).label}</Button>
              )
            )
          )}
        </div>
      </div>
    </div>
  )
}
