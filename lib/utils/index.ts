import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatXp(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`
  return xp.toLocaleString()
}

export function getInitials(name?: string | null): string {
  if (!name) return "?"
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

export function getLevelFromXp(xp: number) {
  const levels = [
    { name: "Beginner",       minXp: 0,     maxXp: 100,   icon: "🌱", color: "#7f90aa" },
    { name: "Explorer",       minXp: 101,   maxXp: 500,   icon: "🧭", color: "#3B82F6" },
    { name: "Analyst",        minXp: 501,   maxXp: 1500,  icon: "📊", color: "#8B5CF6" },
    { name: "Senior Analyst", minXp: 1501,  maxXp: 3000,  icon: "🔍", color: "#F59E0B" },
    { name: "Expert",         minXp: 3001,  maxXp: 6000,  icon: "⚡", color: "#EF4444" },
    { name: "Legend",         minXp: 6001,  maxXp: 999999,icon: "🏆", color: "#2ec4b6" },
  ]
  return [...levels].reverse().find(l => xp >= l.minXp) ?? levels[0]
}

export function getNextLevel(xp: number) {
  const levels = [
    { name: "Explorer",       minXp: 101 },
    { name: "Analyst",        minXp: 501 },
    { name: "Senior Analyst", minXp: 1501 },
    { name: "Expert",         minXp: 3001 },
    { name: "Legend",         minXp: 6001 },
  ]
  return levels.find(l => xp < l.minXp) ?? null
}

export function getLevelProgress(xp: number): number {
  const current = getLevelFromXp(xp)
  const next = getNextLevel(xp)
  if (!next) return 100
  return Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100)
}
