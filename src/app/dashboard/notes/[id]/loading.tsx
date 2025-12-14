export default function Loading() {
  return (
    <div className="container mx-auto p-4 sm:p-5 md:p-6">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="h-6 sm:h-7 md:h-8 w-3/4 sm:w-2/3 rounded bg-muted"></div>
          <div className="h-3 sm:h-3.5 md:h-4 w-1/2 sm:w-2/5 rounded bg-muted"></div>
        </div>

        {/* Content skeleton */}
        <div className="animate-pulse space-y-2 sm:space-y-2.5 md:space-y-3">
          <div className="h-3 sm:h-3.5 md:h-4 w-full rounded bg-muted"></div>
          <div className="h-3 sm:h-3.5 md:h-4 w-full rounded bg-muted"></div>
          <div className="h-3 sm:h-3.5 md:h-4 w-5/6 sm:w-11/12 rounded bg-muted"></div>
          <div className="h-3 sm:h-3.5 md:h-4 w-full rounded bg-muted"></div>
          <div className="h-3 sm:h-3.5 md:h-4 w-4/6 sm:w-3/4 rounded bg-muted"></div>
        </div>

        <div className="flex items-center justify-center pt-6 sm:pt-7 md:pt-8">
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
            <div className="absolute inset-0 rounded-full border-2 sm:border-3 md:border-4 border-primary/20"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-2 sm:border-3 md:border-4 border-transparent border-t-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
