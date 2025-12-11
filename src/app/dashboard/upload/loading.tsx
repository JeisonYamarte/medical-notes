export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-5 md:p-6">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-6 sm:h-7 md:h-8 w-48 sm:w-56 md:w-64 rounded bg-muted"></div>
          <div className="mt-2 h-3 sm:h-3.5 md:h-4 w-64 sm:w-80 md:w-96 max-w-full rounded bg-muted"></div>
        </div>

        {/* Upload area skeleton */}
        <div className="animate-pulse rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
            <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-muted"></div>
            <div className="h-3 sm:h-3.5 md:h-4 w-36 sm:w-40 md:w-48 rounded bg-muted"></div>
            <div className="h-2.5 sm:h-3 w-24 sm:w-28 md:w-32 rounded bg-muted"></div>
          </div>
        </div>

        <div className="flex items-center justify-center pt-3 sm:pt-4">
          <div className="text-center">
            <div className="relative mx-auto h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
              <div className="absolute inset-0 rounded-full border-2 sm:border-3 md:border-4 border-primary/20"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-2 sm:border-3 md:border-4 border-transparent border-t-primary"></div>
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-muted-foreground">Preparando área de carga...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
