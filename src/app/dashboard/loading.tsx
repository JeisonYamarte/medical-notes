export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
          <div className="absolute inset-0 rounded-full border-2 sm:border-3 md:border-4 border-primary/20"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-2 sm:border-3 md:border-4 border-transparent border-t-primary"></div>
        </div>
        <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-lg font-medium text-foreground">Cargando dashboard...</p>
      </div>
    </div>
  );
}
