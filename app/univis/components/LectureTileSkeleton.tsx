import clsx from "clsx"
import SkeletonRow from "app/core/components/SkeletonRow"

const LectureTileSkeleton: React.FC = () => {
  return (
    <div
      className={clsx(
        "dark:bg-slate-700",
        "border-gray-600",
        "border-t-4",
        "p-2",
        "rounded",
        "shadow-md"
      )}
    >
      <SkeletonRow className={clsx("dark:bg-slate-600", "mb-3")} />
      <SkeletonRow size="sm" className={clsx("dark:bg-slate-600", "mb-0")} />
    </div>
  )
}

export default LectureTileSkeleton
