export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 w-64 rounded bg-muted"></div>
          <div className="mt-2 h-4 w-96 rounded bg-muted"></div>
        </div>

        {/* Upload area skeleton */}
        <div className="animate-pulse rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted"></div>
            <div className="h-4 w-48 rounded bg-muted"></div>
            <div className="h-3 w-32 rounded bg-muted"></div>
          </div>
        </div>

        <div className="flex items-center justify-center pt-4">
          <div className="text-center">
            <div className="relative mx-auto h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">Preparando área de carga...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
