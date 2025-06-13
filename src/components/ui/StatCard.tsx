import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
  color: "blue" | "green" | "purple" | "pink" | "emerald";
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    hover: "hover:bg-green-100 dark:hover:bg-green-900/30",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-900/20",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800",
    hover: "hover:bg-pink-100 dark:hover:bg-pink-900/30",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    hover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
  },
};

export default function StatCard({ label, value, icon: Icon, href, color }: StatCardProps) {
  const classes = colorClasses[color];

  return (
    <Link
      href={href}
      className={`block p-4 rounded-lg border transition-colors duration-200 ${classes.bg} ${classes.border} ${classes.hover}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${classes.text}`}>{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-full ${classes.bg}`}>
          <Icon className={`w-6 h-6 ${classes.text}`} />
        </div>
      </div>
    </Link>
  );
}