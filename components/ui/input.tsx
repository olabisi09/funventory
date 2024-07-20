import * as React from "react";

import { cn } from "@/lib/utils";
import { ErrorMessage, Field, FieldProps } from "formik";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const FormInput: React.FC<InputProps> = (props) => {
  const { name, type, className, placeholder, ...rest } = props;
  return (
    <div className="grid gap-2">
      <Field name={name}>
        {({ field }: FieldProps) => (
          <input
            {...field}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
              className
            )}
            placeholder={placeholder}
            {...rest}
          />
        )}
      </Field>
      {name && (
        <ErrorMessage name={name}>
          {(msg) => <small className="bg-error">{msg}</small>}
        </ErrorMessage>
      )}
    </div>
  );
};

FormInput.displayName = "FormInput";

export { Input, FormInput };
