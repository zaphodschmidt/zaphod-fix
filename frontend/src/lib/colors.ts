// Color palette for streak blocks with multiple intensity levels
// Inspired by GitHub contribution graph

export type ColorName = 
  | "red" | "orange" | "amber" | "yellow" | "lime" | "green" 
  | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" 
  | "violet" | "purple" | "fuchsia" | "pink" | "rose" 
  | "slate" | "gray" | "zinc" | "neutral" | "stone";

// Empty/inactive block color
export const EMPTY_BLOCK_CLASS = "bg-muted/40";

// Background classes by color and intensity (for streak blocks)
export const COLOR_CLASSES: Record<string, {
  empty: string;
  light: string;
  medium: string;
  bright: string;
  glow: string;
}> = {
  red: {
    empty: "bg-red-950/30",
    light: "bg-red-800/60",
    medium: "bg-red-600",
    bright: "bg-red-500",
    glow: "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.5)]",
  },
  orange: {
    empty: "bg-orange-950/30",
    light: "bg-orange-800/60",
    medium: "bg-orange-600",
    bright: "bg-orange-500",
    glow: "bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.5)]",
  },
  amber: {
    empty: "bg-amber-950/30",
    light: "bg-amber-800/60",
    medium: "bg-amber-600",
    bright: "bg-amber-500",
    glow: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]",
  },
  yellow: {
    empty: "bg-yellow-950/30",
    light: "bg-yellow-800/60",
    medium: "bg-yellow-600",
    bright: "bg-yellow-500",
    glow: "bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.5)]",
  },
  lime: {
    empty: "bg-lime-950/30",
    light: "bg-lime-800/60",
    medium: "bg-lime-600",
    bright: "bg-lime-500",
    glow: "bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.5)]",
  },
  green: {
    empty: "bg-green-950/30",
    light: "bg-green-800/60",
    medium: "bg-green-600",
    bright: "bg-green-500",
    glow: "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]",
  },
  emerald: {
    empty: "bg-emerald-950/30",
    light: "bg-emerald-800/60",
    medium: "bg-emerald-600",
    bright: "bg-emerald-500",
    glow: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]",
  },
  teal: {
    empty: "bg-teal-950/30",
    light: "bg-teal-800/60",
    medium: "bg-teal-600",
    bright: "bg-teal-500",
    glow: "bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.5)]",
  },
  cyan: {
    empty: "bg-cyan-950/30",
    light: "bg-cyan-800/60",
    medium: "bg-cyan-600",
    bright: "bg-cyan-500",
    glow: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]",
  },
  sky: {
    empty: "bg-sky-950/30",
    light: "bg-sky-800/60",
    medium: "bg-sky-600",
    bright: "bg-sky-500",
    glow: "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]",
  },
  blue: {
    empty: "bg-blue-950/30",
    light: "bg-blue-800/60",
    medium: "bg-blue-600",
    bright: "bg-blue-500",
    glow: "bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]",
  },
  indigo: {
    empty: "bg-indigo-950/30",
    light: "bg-indigo-800/60",
    medium: "bg-indigo-600",
    bright: "bg-indigo-500",
    glow: "bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.5)]",
  },
  violet: {
    empty: "bg-violet-950/30",
    light: "bg-violet-800/60",
    medium: "bg-violet-600",
    bright: "bg-violet-500",
    glow: "bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.5)]",
  },
  purple: {
    empty: "bg-purple-950/30",
    light: "bg-purple-800/60",
    medium: "bg-purple-600",
    bright: "bg-purple-500",
    glow: "bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.5)]",
  },
  fuchsia: {
    empty: "bg-fuchsia-950/30",
    light: "bg-fuchsia-800/60",
    medium: "bg-fuchsia-600",
    bright: "bg-fuchsia-500",
    glow: "bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.5)]",
  },
  pink: {
    empty: "bg-pink-950/30",
    light: "bg-pink-800/60",
    medium: "bg-pink-600",
    bright: "bg-pink-500",
    glow: "bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.5)]",
  },
  rose: {
    empty: "bg-rose-950/30",
    light: "bg-rose-800/60",
    medium: "bg-rose-600",
    bright: "bg-rose-500",
    glow: "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.5)]",
  },
  slate: {
    empty: "bg-slate-900/30",
    light: "bg-slate-700/60",
    medium: "bg-slate-600",
    bright: "bg-slate-500",
    glow: "bg-slate-400 shadow-[0_0_12px_rgba(148,163,184,0.5)]",
  },
  gray: {
    empty: "bg-gray-900/30",
    light: "bg-gray-700/60",
    medium: "bg-gray-600",
    bright: "bg-gray-500",
    glow: "bg-gray-400 shadow-[0_0_12px_rgba(156,163,175,0.5)]",
  },
  zinc: {
    empty: "bg-zinc-900/30",
    light: "bg-zinc-700/60",
    medium: "bg-zinc-600",
    bright: "bg-zinc-500",
    glow: "bg-zinc-400 shadow-[0_0_12px_rgba(161,161,170,0.5)]",
  },
  neutral: {
    empty: "bg-neutral-900/30",
    light: "bg-neutral-700/60",
    medium: "bg-neutral-600",
    bright: "bg-neutral-500",
    glow: "bg-neutral-400 shadow-[0_0_12px_rgba(163,163,163,0.5)]",
  },
  stone: {
    empty: "bg-stone-900/30",
    light: "bg-stone-700/60",
    medium: "bg-stone-600",
    bright: "bg-stone-500",
    glow: "bg-stone-400 shadow-[0_0_12px_rgba(168,162,158,0.5)]",
  },
};

// Get color class for a completed block
export function getBlockClass(color: string, isCompleted: boolean): string {
  const colorSet = COLOR_CLASSES[color] ?? COLOR_CLASSES.gray;
  return isCompleted ? colorSet.bright : EMPTY_BLOCK_CLASS;
}

// Color display names for select dropdowns
export const COLOR_DISPLAY_NAMES: Record<string, string> = {
  red: "Crimson",
  orange: "Sunset",
  amber: "Gold",
  yellow: "Lemon",
  lime: "Lime",
  green: "Forest",
  emerald: "Emerald",
  teal: "Teal",
  cyan: "Cyan",
  sky: "Sky",
  blue: "Ocean",
  indigo: "Indigo",
  violet: "Violet",
  purple: "Grape",
  fuchsia: "Fuchsia",
  pink: "Rose",
  rose: "Blush",
};

// Legacy export for backwards compatibility
export const BG_200_BY_COLOR: Record<string, string> = Object.fromEntries(
  Object.entries(COLOR_CLASSES).map(([key, value]) => [key, value.bright])
);
