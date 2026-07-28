import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const FormContainer: React.FC<FormProps> = ({ children, className = '', ...props }) => {
  return (
    <form className={`space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl ${className}`} {...props}>
      {children}
    </form>
  );
};

export const FormLabel: React.FC<{ htmlFor?: string; children: React.ReactNode; required?: boolean }> = ({
  htmlFor,
  children,
  required,
}) => (
  <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-300 mb-1">
    {children}
    {required && <span className="text-rose-400 ml-0.5">*</span>}
  </label>
);

export const FormErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <p className="text-[11px] font-medium text-rose-400 mt-1">{message}</p>;
};

export const FormHelperText: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  return <p className="text-[11px] text-slate-500 mt-1">{text}</p>;
};
