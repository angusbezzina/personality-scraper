import React from "react";

import { cn } from "../utils";

interface LoadingSpinnerProps {
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
  color?: string;
  size?: number | string;
  fillParent?: boolean;
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, fillParent, color = "currentColor", size = "1.25rem" }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex justify-center text-center",
          fillParent ? "absolute inset-0 items-center" : "w-full",
          className,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill={color}
          width={size}
          height={size}
        >
          <path
            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity=".25"
          />
          <path
            d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
            className="animate-spin origin-center"
          />
        </svg>
      </div>
    );
  },
);
