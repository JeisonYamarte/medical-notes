export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>
        <p className="mt-4 text-base font-medium text-muted-foreground">Cargando notas...</p>
      </div>
    </div>
  );
}
