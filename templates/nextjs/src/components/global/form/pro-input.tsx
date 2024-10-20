import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  ChangeEvent,
} from "react";
import { cn } from "@/lib/utils";

interface ProInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const ProInput = forwardRef<HTMLInputElement, ProInputProps>(
  (
    { value = "", onChange, onClear, className, type, ...restProps },
    forwardedRef
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!, []);

    const handleClear = () => {
      if (innerRef.current) {
        innerRef.current.value = "";
        innerRef.current.focus();

        const syntheticEvent = new Event("input", { bubbles: true });
        Object.defineProperty(syntheticEvent, "target", {
          value: innerRef.current,
        });

        onChange?.(syntheticEvent as unknown as ChangeEvent<HTMLInputElement>);
        onClear?.();
      }
    };

    const showClearButton =
      type === "file"
        ? Boolean(innerRef.current?.files?.length)
        : Boolean(value);

    return (
      <div className="relative">
        <input
          ref={innerRef}
          value={value}
          onChange={onChange}
          type={type}
          className={cn(
            "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            className
          )}
          {...restProps}
        />
        {showClearButton && (
          <button
            onClick={handleClear}
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

ProInput.displayName = "ProInput";

export default ProInput;
