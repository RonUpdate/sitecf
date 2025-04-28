import { Skeleton } from "@/components/ui/skeleton"

export default function NewProductLoading() {
  return (
    <div>
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="flex justify-end gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
