import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  id,
}) => {
  return (
    <div
      id={id}
      className="liquid-glass rounded-[24px] p-8 md:p-12 text-center flex flex-col items-center justify-center my-4 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-full bg-purple-100/70 dark:bg-purple-900/30 border border-purple-200/60 dark:border-purple-700/40 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-300 shadow-[0_4px_16px_rgba(147,51,234,0.12)]">
        {Icon ? (
          <Icon className="w-7 h-7 stroke-[1.6]" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-purple-400/80 animate-[spin_12s_linear_infinite]" />
        )}
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-purple-950 dark:text-purple-100 mb-1 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-purple-900/60 dark:text-purple-300/60 max-w-sm mb-5 font-normal">
          {description}
        </p>
      )}

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all duration-200 shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
