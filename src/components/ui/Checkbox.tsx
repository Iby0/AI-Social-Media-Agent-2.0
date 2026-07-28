import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, checked, className = '', id, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label htmlFor={checkboxId} className="flex items-start gap-2.5 cursor-pointer select-none">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div className="h-4 w-4 rounded-md border border-slate-700 bg-slate-950 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center text-white">
            {checked && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
        </div>

        {(label || description) && (
          <div className="space-y-0.5">
            {label && <span className="text-xs font-semibold text-slate-200">{label}</span>}
            {description && <p className="text-[11px] text-slate-400">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
