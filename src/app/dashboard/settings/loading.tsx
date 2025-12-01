export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 w-48 rounded bg-muted"></div>
        </div>

        {/* Form skeleton */}
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <div className="animate-pulse space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted"></div>
              <div className="h-10 w-full rounded bg-muted"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-muted"></div>
              <div className="h-10 w-full rounded bg-muted"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-muted"></div>
              <div className="h-10 w-full rounded bg-muted"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
