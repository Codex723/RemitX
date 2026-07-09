"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button" | "table-row" | "chart" | "circle";
  width?: string;
  height?: string;
}

export function Skeleton({ className = "", variant = "text", width, height }: SkeletonProps) {
  const base = "skeleton inline-block";

  const variants: Record<string, string> = {
    text: "h-4 w-full",
    card: "h-32 w-full rounded-xl",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-lg",
    "table-row": "h-12 w-full",
    chart: "h-48 w-full rounded-xl",
    circle: "h-16 w-16 rounded-full",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`${base} ${variants[variant] || variants.text} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/** A full-page loading skeleton that mimics the dashboard layout */
export function DashboardSkeleton() {
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="space-y-2 mb-6">
          <Skeleton variant="text" width="200px" height="28px" />
          <Skeleton variant="text" width="300px" height="16px" />
        </div>
        <div className="grid grid-cols-12 gap-3 lg:gap-4">
          {/* Main content area */}
          <div className="col-span-12 lg:col-span-8 space-y-3 lg:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <Skeleton variant="card" height="180px" />
              <Skeleton variant="card" height="180px" />
            </div>
            <Skeleton variant="card" height="100px" />
            <Skeleton variant="card" height="200px" />
          </div>
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-3 lg:space-y-4">
            <Skeleton variant="card" height="280px" />
            <Skeleton variant="card" height="200px" />
            <Skeleton variant="card" height="150px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the send money page */
export function SendSkeleton() {
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="space-y-2 mb-4">
          <Skeleton variant="text" width="250px" height="28px" />
          <Skeleton variant="text" width="350px" height="16px" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton variant="card" height="380px" />
            <Skeleton variant="card" height="100px" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <Skeleton variant="card" height="400px" />
            <Skeleton variant="card" height="60px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the review page */
export function ReviewSkeleton() {
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton variant="text" width="300px" height="16px" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton variant="card" height="300px" />
            <Skeleton variant="card" height="80px" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <Skeleton variant="card" height="200px" />
            <Skeleton variant="card" height="180px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the activity page */
export function ActivitySkeleton() {
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="space-y-2 mb-4">
          <Skeleton variant="text" width="200px" height="28px" />
          <Skeleton variant="text" width="250px" height="16px" />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <Skeleton variant="card" height="200px" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Skeleton variant="card" height="200px" />
          </div>
          <div className="col-span-12">
            <Skeleton variant="card" height="350px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Generic page skeleton for simple pages */
export function PageSkeleton() {
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="space-y-2 mb-4">
          <Skeleton variant="text" width="200px" height="28px" />
          <Skeleton variant="text" width="300px" height="16px" />
        </div>
        <Skeleton variant="card" height="400px" />
      </div>
    </div>
  );
}

/** Landing page skeleton */
export function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Nav skeleton */}
      <div className="h-header-height flex items-center px-4 lg:px-8 border-b border-gray-200">
        <div className="flex items-center gap-3 w-full">
          <Skeleton variant="circle" width="32px" height="32px" />
          <Skeleton variant="text" width="80px" height="20px" />
          <div className="hidden md:flex gap-6 ml-auto">
            <Skeleton variant="text" width="60px" height="14px" />
            <Skeleton variant="text" width="70px" height="14px" />
            <Skeleton variant="text" width="80px" height="14px" />
          </div>
          <div className="ml-auto flex gap-3">
            <Skeleton variant="button" width="80px" height="36px" />
            <Skeleton variant="button" width="120px" height="36px" />
          </div>
        </div>
      </div>
      {/* Hero skeleton */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4">
            <Skeleton variant="text" width="120px" height="24px" />
            <Skeleton variant="text" width="100%" height="48px" />
            <Skeleton variant="text" width="80%" height="48px" />
            <Skeleton variant="text" width="90%" height="20px" />
            <div className="flex gap-3 pt-2">
              <Skeleton variant="button" width="140px" height="44px" />
              <Skeleton variant="button" width="120px" height="44px" />
            </div>
          </div>
          <div className="hidden lg:block">
            <Skeleton variant="card" height="350px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Login page skeleton */
export function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Skeleton variant="circle" width="28px" height="28px" />
            <Skeleton variant="text" width="80px" height="24px" />
          </div>
          <Skeleton variant="text" width="150px" height="20px" className="mx-auto" />
          <Skeleton variant="text" width="200px" height="14px" className="mx-auto" />
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 space-y-4">
          <Skeleton variant="text" width="100%" height="48px" />
          <Skeleton variant="text" width="100%" height="48px" />
          <Skeleton variant="button" width="100%" height="44px" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;