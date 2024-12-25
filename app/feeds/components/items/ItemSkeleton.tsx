import React from "react"
import clsx from "clsx"

const ItemSkeleton = () => (
  <div
    className={clsx(
      "animate-pulse",
      "bg-slate-200",
      "dark:bg-slate-700",
      "border-b-2",
      "border-slate-100",
      "dark:border-slate-600",
      "h-16",
      "top-0",
      "w-full",
    )}
  />
)

export default ItemSkeleton
