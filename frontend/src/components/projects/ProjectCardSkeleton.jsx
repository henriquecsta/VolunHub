function ProjectCardSkeleton() {
  return (
    <article className="surface-card flex h-full flex-col justify-between p-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="h-7 w-28 animate-pulse rounded-full bg-mist-200" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-mist-100" />
        </div>
        <div className="space-y-3">
          <div className="h-8 w-4/5 animate-pulse rounded-full bg-mist-200" />
          <div className="h-5 w-2/5 animate-pulse rounded-full bg-mist-100" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-full bg-mist-100" />
            <div className="h-4 w-11/12 animate-pulse rounded-full bg-mist-100" />
            <div className="h-4 w-4/6 animate-pulse rounded-full bg-mist-100" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded-full bg-mist-100" />
          <div className="h-4 w-16 animate-pulse rounded-full bg-mist-100" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-full bg-mist-200" />
      </div>
    </article>
  );
}

export default ProjectCardSkeleton;
