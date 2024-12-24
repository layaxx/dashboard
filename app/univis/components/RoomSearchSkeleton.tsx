import clsx from "clsx"
import SkeletonRow from "app/core/components/SkeletonRow"

const RoomSearchSkeleton: React.FC = () => {
  return (
    <div>
      <h3 className={clsx("font-bold", "text-2xl")}>
        <span
          className={clsx(
            "animate-pulse",
            "bg-slate-200",
            "dark:bg-slate-500",
            "h-6",
            "inline-block",
            "w-6",
          )}
        />{" "}
        rooms found
      </h3>
      <div className={clsx("gap-x-4", "gap-y-2", "md:gap-y-8", "grid", "md:grid-cols-2")}>
        {Array.from({ length: 3 }, (_, index) => index).map((key) => (
          <SkeletonRow key={key} />
        ))}
      </div>
    </div>
  )
}

export default RoomSearchSkeleton
