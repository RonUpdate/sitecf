import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonLoaderProps {
  type?: "table" | "form" | "card" | "dashboard"
  count?: number
}

export function SkeletonLoader({ type = "table", count = 5 }: SkeletonLoaderProps) {
  if (type === "table") {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="border rounded-md">
          <div className="p-4 border-b bg-muted/40">
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[200px] ml-auto" />
              <Skeleton className="h-4 w-[100px] ml-4" />
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-[300px]" />
                  <Skeleton className="h-4 w-[150px] ml-auto" />
                  <Skeleton className="h-8 w-8 ml-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === "form") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[300px]" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
          <div className="pt-4">
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
      </div>
    )
  }

  if (type === "card") {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-32 w-full rounded-md" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-4 w-[60%]" />
              <Skeleton className="h-8 w-[80%]" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-[200px]" />
            <div className="h-[300px] w-full flex items-center justify-center">
              <Skeleton className="h-[250px] w-[90%] rounded-md" />
            </div>
          </div>
          <div className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-[200px]" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-[70%]" />
                  <Skeleton className="h-4 w-[15%] ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
