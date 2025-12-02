import { Plus, BookOpenText, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickAction = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Tạo dây mới",
      icon: <Plus className="w-6 h-6 text-white" />,
      color: "bg-blue-600",
      path: "/create-group",
      desc: "Thêm dây 12",
    },
    {
      title: "Sổ thu chi",
      icon: <BookOpenText className="w-6 h-6 text-white" />,
      color: "bg-orange-500",
      path: "/transactions",
      desc: "Lịch sử dòng tiền",
    },
    {
      title: "Danh bạ",
      icon: <Users className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
      path: "/players",
      desc: "Quản lý người chơi",
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Tiện ích</h3>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => navigate(actions[0].path)}
          className="col-span-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform"
        >
          <div
            className={`w-12 h-12 ${actions[0].color} rounded-full flex items-center justify-center shadow-md shadow-blue-200`}
          >
            {actions[0].icon}
          </div>
          <div className="text-left flex-1">
            <h4 className="font-bold text-gray-900">{actions[0].title}</h4>
            <p className="text-sm text-gray-500">{actions[0].desc}</p>
          </div>
          <div className="bg-gray-50 px-3 py-1 rounded-full text-xs font-bold text-blue-600">
            Bắt đầu ngay
          </div>
        </button>

        {actions.slice(1).map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform h-28"
          >
            <div
              className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center shadow-sm`}
            >
              {item.icon}
            </div>
            <span className="text-xs font-bold text-gray-700 text-center leading-tight">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAction;
