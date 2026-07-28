import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  characterCount?: number;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, characterCount, maxLength, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-300">
              {label}
            </label>
          )}

          {maxLength !== undefined && characterCount !== undefined && (
            <span
              className={`text-[10px] font-mono ${
                characterCount > maxLength ? 'text-rose-400 font-bold' : 'text-slate-500'
              }`}
            >
              {characterCount} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full bg-slate-950 border text-xs text-white placeholder-slate-500 rounded-xl p-3 outline-none transition-all focus:ring-1 resize-y ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
              : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
          } ${className}`}
          {...props}
        />

        {error && <p className="text-[11px] font-medium text-rose-400">{error}</p>}
        {!error && helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
