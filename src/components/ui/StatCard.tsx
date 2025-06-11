import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: number;
  positive?: boolean;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  positive = true,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 ${className}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </h3>
          
          {/* Show change indicator if provided */}
          {typeof change !== "undefined" && (
            <div className="flex items-center mt-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  positive
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                }`}
              >
                {positive ? "+" : "-"}
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                from previous period
              </span>
            </div>
          )}
        </div>
        
        {/* Icon */}
        {icon && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
