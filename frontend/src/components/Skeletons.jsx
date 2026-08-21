import React from "react";

export const StatCardSkeleton = () => (
  <div className="glass-panel p-5">
    <div className="skeleton h-3 w-24 mb-4" />
    <div className="skeleton h-8 w-16" />
  </div>
);

export const CardSkeleton = () => (
  <div className="glass-panel p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-5 w-20 rounded-full" />
    </div>
    <div className="skeleton h-3 w-full mb-2" />
    <div className="skeleton h-3 w-2/3 mb-5" />
    <div className="flex gap-2">
      <div className="skeleton h-9 flex-1" />
      <div className="skeleton h-9 flex-1" />
    </div>
  </div>
);

export const RowSkeleton = () => (
  <div className="flex items-center gap-4 px-5 py-4">
    <div className="skeleton h-3 w-32" />
    <div className="skeleton h-3 w-20" />
    <div className="skeleton h-5 w-16 rounded-full" />
    <div className="skeleton h-3 w-24 ml-auto" />
  </div>
);
