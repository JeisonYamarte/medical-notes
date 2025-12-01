export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700">Cargando inicio de sesión...</p>
      </div>
    </div>
  );
}
