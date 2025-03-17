import clsx from "clsx"
import LectureTileSkeleton from "./LectureTileSkeleton"

const LectureSearchSkeleton: React.FC = () => {
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
            "w-6"
          )}
        />{" "}
        lectures found
      </h3>
      <div className={clsx("gap-x-4", "gap-y-2", "md:gap-y-8", "grid", "md:grid-cols-2")}>
        {Array.from({ length: 3 }, (_, index) => index).map((key) => (
          <LectureTileSkeleton key={key} />
        ))}
      </div>
    </div>
  )
}

export default LectureSearchSkeleton
