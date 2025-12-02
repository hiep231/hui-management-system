import React, { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
}) => {
  return <div className={`p-3 pb-32 ${className}`}>{children}</div>;
};

export default PageContainer;
