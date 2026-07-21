/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";

interface StatRingProps {
  label: string;
  value: number; // 0 to 100
  color: string; // Tailwind accent border colour (like border-orange-500)
  iconName: keyof typeof Icons;
  title: string; // Display title, e.g. "GPA"
  subText?: string; // Optional extra display like "3.20"
  isUrgent?: boolean; // If stress is > 80% or others < 20%
}

export const StatRing: React.FC<StatRingProps> = ({
  label,
  value,
  color,
  iconName,
  title,
  subText,
  isUrgent = false,
}) => {
  // Get the Lucide icon from name
  const IconComponent = Icons[iconName] as React.ComponentType<{ className?: string }>;

  // Calculate SVG stroke parameters
  // Radius = 15.9155 makes the circumference exactly 100, so strokeDasharray matches percentage value perfectly!
  const radius = 15.9155;
  const strokeDashoffset = 100 - Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col items-center justify-center p-1.5 transition-all duration-300">
      {/* Circle Container */}
      <div className="relative flex items-center justify-center">
        {/* Animated Warning Glow */}
        {isUrgent && (
          <span className="absolute inline-flex h-12 w-12 rounded-full bg-red-400 opacity-30 animate-ping" />
        )}

        <motion.div
          whileTap={{ scale: 0.92 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900/60 border border-zinc-800/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-all hover:border-amber-500/20"
        >
          {/* Circular Progress SVG */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
            {/* Background track circle */}
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke="#141417"
              strokeWidth="2.8"
            />
            {/* Foreground progress circle */}
            <motion.circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray="100"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </svg>

          {/* Active Center Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center text-stone-200">
            {IconComponent ? (
              <IconComponent className={`h-4.5 w-4.5 ${isUrgent ? "text-red-400 animate-pulse" : "text-stone-300"}`} />
            ) : (
              <span className="text-xs">?</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Label section */}
      <div className="mt-1.5 text-center">
        <p className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest">{title}</p>
        <p className={`text-[11px] font-bold tracking-tight leading-tight mt-0.5 ${isUrgent ? "text-red-400 animate-pulse" : "text-stone-100"}`}>
          {subText || `${Math.round(value)}%`}
        </p>
      </div>
    </div>
  );
};
