import { cn } from "@/utils";
import React, { ReactNode } from "react";

interface HeaderProps {
  className?: string;
  children: ReactNode;
}

const Header: React.FC<HeaderProps> = React.memo(({ className, children }) => {
  return (
    <div className="shadow-md sticky top-0 bg-white z-[999]">
      <div className="flex w-full flex-col">
        <div
          className={cn("px-4 py-4", className)}
          style={{
            padding:
              "calc(var(--zaui-safe-area-inset-top, 0px) + 15px) 4.3rem .8rem 1rem",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

export default Header;
