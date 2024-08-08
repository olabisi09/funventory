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
          "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
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
              "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
              className
            )}
            placeholder={placeholder}
            {...rest}
          />
        )}
      </Field>
      {name && (
        <ErrorMessage name={name}>
          {(msg) => <small className="text-error">{msg}</small>}
        </ErrorMessage>
      )}
    </div>
  );
};

FormInput.displayName = "FormInput";

export { Input, FormInput };
