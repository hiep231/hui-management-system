import React, { ReactNode } from "react";

type TitleProps = {
  children: ReactNode;
  className?: string;
};

const Title: React.FC<TitleProps> = ({ children, className }) => {
  return <div className={`text-lg font-semibold ${className}`}>{children}</div>;
};

export default Title;
