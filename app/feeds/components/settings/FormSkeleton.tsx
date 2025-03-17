import React from "react"
import clsx from "clsx"
import SkeletonRow from "app/core/components/SkeletonRow"

const SettingsFormSkeleton = () => {
  return (
    <div
      className={clsx(
        "bg-white",
        "border-purple-700",
        "border-solid",
        "border-t-4",
        "max-w-lg",
        "min-h-48",
        "my-4",
        "px-8",
        "py-4",
        "rounded-lg",
        "shadow-lg",
        "w-full"
      )}
    >
      <SkeletonRow size="lg" />
      <SkeletonRow className="mt-4" />
      <SkeletonRow className="mt-4" />
      <SkeletonRow className="mt-4" />
      <SkeletonRow className="mt-4" />
      <SkeletonRow className="mt-4" size="lg" />
    </div>
  )
}

export default SettingsFormSkeleton
