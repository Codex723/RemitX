"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button" | "table-row" | "chart" | "circle";
  width?: string;
  height?: string;
}

const shimmerKeyframes = `
@keyframes remitxShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`;

function ShimmerStyle({ id }: { id: string }) {
  return (
    <style>{`${shimmerKeyframes} .${id} { background: linear-gradient(90deg, #f2f4f7 25%, #e6e8eb 50%, #f2f4f7 75%); background-size: 200% 100%; animation: remitxShimmer 1.5s infinite; border-radius: 0.5rem; display: block; }`}</style>
  );
}

let shimmerId = 0;

export function Skeleton({ className = "", variant = "text", width, height }: SkeletonProps) {
  const id = React.useMemo(() => `sk-${++shimmerId}`, []);

  const variants: Record<string, string> = {
    text: "h-4",
    card: "h-32 rounded-xl",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-lg",
    "table-row": "h-12",
    chart: "h-48 rounded-xl",
    circle: "h-16 w-16 rounded-full",
  };

  const defaultWidth = variant === "text" || variant === "card" || variant === "table-row" || variant === "chart" || variant === "button" ? "100%" : undefined;

  const style: React.CSSProperties = {
    width: width || defaultWidth,
    height: height,
  };

  return (
    <>
      <ShimmerStyle id={id} />
      <div
        className={`${id} ${variants[variant] || variants.text} ${className}`}
        style={style}
        aria-hidden="true"
      />
    </>
  );
}

/** A full-page loading skeleton that mimics the dashboard layout */
export function DashboardSkeleton() {
  const S = Skeleton;
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="space-y-2 mb-6">
          <S variant="text" width="200px" height="28px" />
          <S variant="text" width="300px" height="16px" />
        </div>
        <div className="grid grid-cols-12 gap-3 lg:gap-4">
          <div className="col-span-12 lg:col-span-8 space-y-3 lg:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <S variant="card" height="180px" />
              <S variant="card" height="180px" />
            </div>
            <S variant="card" height="100px" />
            <S variant="card" height="200px" />
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-3 lg:space-y-4">
            <S variant="card" height="280px" />
            <S variant="card" height="200px" />
            <S variant="card" height="150px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the send money page */
export function SendSkeleton() {
  const S = Skeleton;
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="space-y-2 mb-4">
          <S variant="text" width="250px" height="28px" />
          <S variant="text" width="350px" height="16px" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-7 space-y-4">
            <S variant="card" height="380px" />
            <S variant="card" height="100px" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <S variant="card" height="400px" />
            <S variant="card" height="60px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the review page */
export function ReviewSkeleton() {
  const S = Skeleton;
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto space-y-4">
        <S variant="text" width="300px" height="16px" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-7 space-y-4">
            <S variant="card" height="300px" />
            <S variant="card" height="80px" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <S variant="card" height="200px" />
            <S variant="card" height="180px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the activity page */
export function ActivitySkeleton() {
  const S = Skeleton;
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="space-y-2 mb-4">
          <S variant="text" width="200px" height="28px" />
          <S variant="text" width="250px" height="16px" />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <S variant="card" height="200px" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <S variant="card" height="200px" />
          </div>
          <div className="col-span-12">
            <S variant="card" height="350px" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Generic page skeleton for simple pages */
export function PageSkeleton() {
  const S = Skeleton;
  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="space-y-2 mb-4">
          <S variant="text" width="200px" height="28px" />
          <S variant="text" width="300px" height="16px" />
        </div>
        <S variant="card" height="400px" />
      </div>
    </div>
  );
}

/** Landing page skeleton */
export function LandingSkeleton() {
  const S = Skeleton;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Fixed Nav skeleton */}
      <div className="h-header-height fixed top-0 right-0 left-0 z-50 flex items-center px-4 lg:px-8 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 w-full">
          <S variant="circle" width="32px" height="32px" />
          <S variant="text" width="80px" height="20px" />
          <div className="hidden md:flex gap-6 ml-auto">
            <S variant="text" width="60px" height="14px" />
            <S variant="text" width="70px" height="14px" />
            <S variant="text" width="80px" height="14px" />
          </div>
          <div className="ml-auto flex gap-3">
            <S variant="button" width="80px" height="36px" />
            <S variant="button" width="120px" height="36px" />
          </div>
        </div>
      </div>
      {/* Hero skeleton */}
      <div className="pt-header-height min-h-[600px] lg:min-h-[800px] flex items-center px-4 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <S variant="text" width="120px" height="24px" />
              <S variant="text" width="100%" height="48px" />
              <S variant="text" width="80%" height="48px" />
              <S variant="text" width="90%" height="20px" />
              <div className="flex gap-3 pt-2">
                <S variant="button" width="140px" height="44px" />
                <S variant="button" width="120px" height="44px" />
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <S variant="card" height="350px" width="400px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Login page skeleton */
export function LoginSkeleton() {
  const S = Skeleton;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <S variant="circle" width="28px" height="28px" />
            <S variant="text" width="80px" height="24px" />
          </div>
          <S variant="text" width="150px" height="20px" className="mx-auto" />
          <S variant="text" width="200px" height="14px" className="mx-auto" />
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 space-y-4">
          <S variant="text" width="100%" height="48px" />
          <S variant="text" width="100%" height="48px" />
          <S variant="button" width="100%" height="44px" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;