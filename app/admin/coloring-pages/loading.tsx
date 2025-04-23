import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}
