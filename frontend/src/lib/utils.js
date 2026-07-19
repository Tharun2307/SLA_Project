import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTimeRemaining(deadline) {
  const now = new Date().getTime();
  const end = new Date(deadline).getTime();
  const diff = end - now;

  if (diff <= 0) return { expired: true, hours: 0, minutes: 0, seconds: 0, percentage: 0 };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Percentage of SLA remaining (assuming 4 hours)
  const totalSla = 4 * 60 * 60 * 1000;
  const percentage = Math.min(100, Math.max(0, (diff / totalSla) * 100));

  return { expired: false, hours, minutes, seconds, percentage };
}

export function getStatusColor(status) {
  switch (status) {
    case "OPEN": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "IN_PROGRESS": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "RESOLVED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "REJECTED": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

export function getPriorityColor(priority) {
  switch (priority) {
    case "HIGH": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "MEDIUM": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "LOW": return "bg-green-500/20 text-green-400 border-green-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

export function getRoleColor(role) {
  switch (role) {
    case "USER": return "text-blue-400";
    case "EMPLOYEE": return "text-emerald-400";
    case "DEPT_HEAD": return "text-purple-400";
    case "ADMIN": return "text-amber-400";
    default: return "text-gray-400";
  }
}
