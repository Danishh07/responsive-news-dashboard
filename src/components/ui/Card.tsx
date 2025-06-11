/**
 * Card UI Component
 * 
 * A reusable card container component that provides consistent styling
 * and structure throughout the dashboard application.
 * 
 * Features:
 * - Clean, modern card design with shadows and rounded corners
 * - Dark mode support with automatic theme switching
 * - Optional icon support for enhanced visual hierarchy
 * - Flexible content area that accepts any React children
 * - Customizable styling through className prop
 * - Responsive design that works on all screen sizes
 * - Accessibility-friendly structure with proper headings
 * 
 * Usage:
 * ```tsx
 * <Card title="Statistics" icon={<FaChart />}>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */

import { ReactNode } from "react";

/**
 * Props interface for the Card component
 */
interface CardProps {
  title: string;          // Card title displayed in the header
  icon?: ReactNode;       // Optional icon displayed next to the title
  children: ReactNode;    // Content to be rendered inside the card body
  className?: string;     // Additional CSS classes for customization
}

export default function Card({ title, icon, children, className = "" }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Card Header with Title and Optional Icon */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h3>
      </div>
      
      {/* Card Body Content Area */}
      <div className="p-4">{children}</div>
    </div>
  );
}
