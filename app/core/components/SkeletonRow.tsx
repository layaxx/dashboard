import React from "react"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

type Props = {
  size?: "lg" | "md" | "sm"
  className?: string
}

const SkeletonRow = ({ size, className }: Props) => (
  <p
    className={twMerge(
      clsx(
        "animate-pulse",
        "bg-slate-200",
        "dark:bg-slate-700",
        size === "sm" && "h-4",
        (size === undefined || size === "md") && "h-6",
        size === "lg" && "h-8",
        "mb-2",
        "w-full",
      ),
      className,
    )}
  />
)

export default SkeletonRow
