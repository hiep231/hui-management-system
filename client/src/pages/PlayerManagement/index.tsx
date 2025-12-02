import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import ListUser from "./ListUser";
import AddUserModal from "./AddUserModal";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { UserPlus } from "lucide-react";

const PlayerManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Danh bạ người chơi
          </h1>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            className="!h-9 !px-3 !text-sm !rounded-lg flex items-center gap-1 shadow-sm bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus size={18} />{" "}
            <span className="hidden sm:inline">Thêm mới</span>
          </Button>
        </div>
      </Header>

      <PageContainer className="flex-1 pt-4">
        <ListUser />
      </PageContainer>

      <AddUserModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
export default PlayerManagement;
