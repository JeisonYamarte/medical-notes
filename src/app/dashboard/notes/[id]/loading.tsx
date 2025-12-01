export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-3/4 rounded bg-muted"></div>
          <div className="h-4 w-1/2 rounded bg-muted"></div>
        </div>

        {/* Content skeleton */}
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-5/6 rounded bg-muted"></div>
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-4/6 rounded bg-muted"></div>
        </div>

        <div className="flex items-center justify-center pt-8">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
