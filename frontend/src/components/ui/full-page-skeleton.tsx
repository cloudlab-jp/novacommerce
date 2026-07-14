export function FullPageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm space-y-3 px-6">
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-24 w-full animate-pulse rounded-xl bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
