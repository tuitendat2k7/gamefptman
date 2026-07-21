/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Signal, Wifi, Battery, AlertTriangle } from "lucide-react";

interface IPhoneFrameProps {
  children: React.ReactNode;
  dynamicIslandMessage?: string | null;
  dynamicIslandColor?: string; // bg hex or tailwind bg class
  disableBezel?: boolean; // Toggles whether to show the simulator bezel
  onToggleBezel?: () => void;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  children,
  dynamicIslandMessage = null,
  dynamicIslandColor = "bg-slate-900 border-slate-800",
  disableBezel = false,
  onToggleBezel,
}) => {
  // Get active system time for top display
  const [timeStr, setTimeStr] = React.useState("09:41");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const hStr = hours < 10 ? `0${hours}` : `${hours}`;
      const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setTimeStr(`${hStr}:${mStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  if (disableBezel) {
    // Return pure mobile view container
    return (
      <div className="relative w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
        {/* Simple top status padding */}
        <div className="h-6 w-full" />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 via-neutral-950 to-stone-900 px-4 py-8 overflow-y-auto selection:bg-amber-500/20 selection:text-amber-200">
      {/* Absolute Header helper in workspace */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-stone-400 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse"></span>
          <span className="font-medium tracking-wide">iPhone notched 19.5:9 Preview Target</span>
        </div>
        <button
          onClick={onToggleBezel}
          className="px-3 py-1.5 rounded-full bg-zinc-950 border border-zinc-900 hover:border-amber-500/20 hover:bg-neutral-900 text-stone-300 font-medium transition active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          {disableBezel ? "Hiện viền iPhone" : "Khung tràn viền (Xcode Target)"}
        </button>
      </div>

      {/* Main iPhone Body Mockup */}
      <div className="relative w-[400px] h-[840px] rounded-[52px] border-[12px] border-neutral-900 bg-neutral-950 shadow-[0_0_95px_rgba(0,0,0,0.95),0_0_55px_rgba(212,175,55,0.03)] flex flex-col overflow-hidden transition-all duration-300 my-auto ring-4 ring-neutral-800/20">
        {/* Antennas and side clickers */}
        <div className="absolute left-[-15px] top-[140px] w-[3px] h-[34px] bg-slate-800 rounded-r-lg"></div>
        <div className="absolute left-[-15px] top-[190px] w-[3px] h-[55px] bg-slate-800 rounded-r-lg"></div>
        <div className="absolute left-[-15px] top-[255px] w-[3px] h-[55px] bg-slate-800 rounded-r-lg"></div>
        <div className="absolute right-[-15px] top-[210px] w-[3px] h-[75px] bg-slate-800 rounded-l-lg"></div>

        {/* Top iOS Status Bar (Safe Area) */}
        <div className="relative z-50 h-11 w-full px-7 flex items-center justify-between bg-transparent select-none text-slate-200">
          {/* Status Left: Time */}
          <div className="text-[13px] font-bold tracking-tight text-white select-none">
            {timeStr}
          </div>

          {/* Dynamic Island / Notch Container */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 z-50">
            <AnimatePresence mode="wait">
              {dynamicIslandMessage ? (
                // Explanded Dynamic Island Alert
                <motion.div
                  key="expanded"
                  initial={{ width: 110, height: 26, borderRadius: 13, y: 0 }}
                  animate={{ width: 220, height: 38, borderRadius: 19, y: 1 }}
                  exit={{ width: 110, height: 26, borderRadius: 13, y: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={`flex items-center justify-center gap-1.5 px-3 border shadow-md text-xs font-semibold ${dynamicIslandColor} text-white`}
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
                  <span className="truncate max-w-[160px] tracking-wide text-[11px]">
                    {dynamicIslandMessage}
                  </span>
                </motion.div>
              ) : (
                // Default Compact Dynamic Island
                <motion.div
                  key="compact"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="w-[110px] h-[26px] bg-black rounded-full border border-neutral-900 flex items-center justify-center"
                >
                  {/* Mock camera lens glare */}
                  <div className="w-2.5 h-2.5 rounded-full bg-[#080d24] absolute right-4 opacity-50"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Right: Signals & Battery */}
          <div className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5 text-white" />
            <Wifi className="h-3.5 w-3.5 text-white" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold text-white/90">98%</span>
              <Battery className="h-4 w-4 text-white fill-white/80" />
            </div>
          </div>
        </div>

        {/* Dynamic Safe Area Padding for notch content */}
        <div className="h-1" />

        {/* Internal Screen Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Bottom iOS Home Indicator Indicator */}
        <div className="h-6 w-full flex items-center justify-center bg-slate-950 pb-2 select-none">
          <div className="w-32 h-1 rounded-full bg-white opacity-40"></div>
        </div>
      </div>
    </div>
  );
};
