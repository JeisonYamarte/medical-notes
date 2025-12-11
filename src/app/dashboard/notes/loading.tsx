export default function Loading() {
  return (
    <div className="flex min-h-[50dvh] sm:min-h-[55dvh] md:min-h-[60dvh] items-center justify-center px-4">
      <div className="text-center">
        <div className="relative mx-auto h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20">
          <div className="absolute inset-0 rounded-full border-2 sm:border-3 md:border-4 border-primary/20"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-2 sm:border-3 md:border-4 border-transparent border-t-primary"></div>
        </div>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base font-medium text-muted-foreground">Cargando notas...</p>
      </div>
    </div>
  );
}
