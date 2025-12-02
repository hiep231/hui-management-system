import { Button } from "@/components/ui/Button";
import React from "react";
import { Eye } from "lucide-react";

type TButtonViewDetailProps = {
  onClick: (e) => void;
};

const ButtonViewDetail = ({ onClick }: TButtonViewDetailProps) => {
  return (
    <Button
      onClick={onClick}
      className="bg-green-500 text-white px-2 py-1 rounded-md"
      classNameChildren="gap-1.5 w-max"
    >
      <Eye className="h-4 w-4" />
      Chi tiết
    </Button>
  );
};

export default ButtonViewDetail;
