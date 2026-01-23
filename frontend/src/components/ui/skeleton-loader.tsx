import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function IntentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 p-6 bg-card hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div>
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>

      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />

      <div className="flex gap-2 mt-4">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  );
}

export function SpinnerLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="loader"></div>
      <style>{`
        .loader {
          width: 50px;
          aspect-ratio: 1;
          display: grid;
          border: 4px solid #0000;
          border-radius: 50%;
          border-right-color: #25b09b;
          animation: l15 1s infinite linear;
        }
        .loader::before,
        .loader::after {    
          content: "";
          grid-area: 1/1;
          margin: 2px;
          border: inherit;
          border-radius: 50%;
          animation: l15 2s infinite;
        }
        .loader::after {
          margin: 8px;
          animation-duration: 3s;
        }
        @keyframes l15{ 
          100%{transform: rotate(1turn)}
        }
      `}</style>
    </div>
  );
}
