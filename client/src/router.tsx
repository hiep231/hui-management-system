import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import CreateGroup from "./pages/CreateGroup";
import Dashboard from "./pages/Dashboard";
import FullGroupDetail from "./pages/FullGroupDetail";
import GroupChildManagement from "./pages/GroupChildManagement";
import GroupManagement from "./pages/GroupManagement";
import Login from "./pages/Login";
import PlayerDetail from "./pages/PlayerDetail";
import PlayerManagement from "./pages/PlayerManagement";
import TransactionHistory from "./pages/TransactionHistory";

export type THandle = {
  disbledBottom: boolean;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
        handle: {
          disbledBottom: true,
        },
      },
      {
        path: "/create-group",
        element: (
          <ProtectedRoute>
            <CreateGroup />
          </ProtectedRoute>
        ),
        handle: {
          disbledBottom: true,
        },
      },
      {
        path: "/players",
        element: (
          <ProtectedRoute>
            <PlayerManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/player-detail",
        element: (
          <ProtectedRoute>
            <PlayerDetail />
          </ProtectedRoute>
        ),
        handle: { disbledBottom: true },
      },
      {
        path: "/groups",
        element: (
          <ProtectedRoute>
            <GroupManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/groups-child",
        element: (
          <ProtectedRoute>
            <GroupChildManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/group-detail",
        element: (
          <ProtectedRoute>
            <FullGroupDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/transactions",
        element: (
          <ProtectedRoute>
            <TransactionHistory />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
