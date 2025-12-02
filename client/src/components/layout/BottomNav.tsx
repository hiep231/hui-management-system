import { useLocation, useNavigate } from "react-router";
import { Home, Users, Layers, BookOpenText } from "lucide-react";
import { cn } from "@/utils";

const navItems = [
  {
    label: "Trang chủ",
    path: "/",
    matchPaths: ["/"],
    icon: <Home size={28} strokeWidth={2.5} />,
  },
  {
    label: "Sổ thu chi",
    path: "/transactions",
    matchPaths: ["/transactions"],
    icon: <BookOpenText size={28} strokeWidth={2.5} />,
  },
  {
    label: "Dây hụi",
    path: "/groups",
    matchPaths: ["/groups", "/groups-child", "/group-detail", "/create-group"],
    icon: <Layers size={28} strokeWidth={2.5} />,
  },
  {
    label: "Người chơi",
    path: "/players",
    matchPaths: ["/players", "/player-detail"],
    icon: <Users size={28} strokeWidth={2.5} />,
  },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-white border-t-2 border-gray-200 fixed bottom-0 left-0 right-0 z-[10] pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-[80px]">
        {navItems.map((item) => {
          const isActive = item.matchPaths.some((p) =>
            p === "/" ? currentPath === "/" : currentPath.startsWith(p)
          );

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-all active:scale-95",
                isActive ? "text-primary" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <div
                className={cn(
                  "mb-1 transition-transform",
                  isActive && "scale-110 transform"
                )}
              >
                {item.icon}
              </div>
              <span
                className={cn(
                  "text-xs font-bold tracking-wide",
                  isActive ? "text-primary" : "text-gray-700"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
