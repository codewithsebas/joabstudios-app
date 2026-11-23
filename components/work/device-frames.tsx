import Image from 'next/image'
import type { ProjectScreenshot } from '@/lib/content/projects'
import { cn } from '@/lib/cn'

export function BrowserFrame({
  shot,
  host,
  sizes,
  priority = false,
  className,
}: {
  shot: ProjectScreenshot
  host: string | null
  sizes: string
  priority?: boolean
  className?: string
}) {
  return (
    <figure className={cn('overflow-hidden rounded-[var(--radius-card)] bg-ivory-200 ring-1 ring-charcoal/10', className)}>
      <div aria-hidden className="flex h-9 items-center gap-1.5 border-b border-charcoal/10 px-4">
        <span className="size-2.5 rounded-full bg-charcoal/15" />
        <span className="size-2.5 rounded-full bg-charcoal/15" />
        <span className="size-2.5 rounded-full bg-charcoal/15" />
        {host ? (
          <span className="mx-auto rounded-full bg-ivory px-4 py-0.5 font-ui text-[0.7rem] text-stone">{host}</span>
        ) : null}
      </div>
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full"
      />
    </figure>
  )
}

export function PhoneFrame({ shot, sizes, className }: { shot: ProjectScreenshot; sizes: string; className?: string }) {
  return (
    <figure className={cn('overflow-hidden rounded-[2rem] bg-charcoal p-2 shadow-xl shadow-forest/15', className)}>
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        className="h-auto w-full rounded-[1.6rem]"
      />
    </figure>
  )
}
