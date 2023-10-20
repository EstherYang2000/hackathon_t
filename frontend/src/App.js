import "./App.css";
import "./styles/global.css";
import { Outlet } from "react-router-dom";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import NoMatchPage from "./pages/NoMatchPage";
import AnalysisResult from "./pages/AnalysisResult";

import Attendance from "./pages/Attendance";
import AttendanceDashboard from "./pages/Attendance/Dashboard";
import AttendanceReport from "./pages/Attendance/Report";
import EntryHistory from "./pages/Attendance/EntryHistory";

import Security from "./pages/Security";
import SecurityReport from "./pages/Security/Report";
import EntryRecord from "./pages/Security/EntryRecord";
import Maintain from "./pages/Security/Maintain";

function App() {
  const router = createBrowserRouter([
    {
      errorElement: <NoMatchPage />,
      children: [
        {
          path: "/", // Set up a redirect for the root path
          element: <Navigate to="/upload" />, // Redirect to the "/upload" route
        },
        {
          path: "/upload",
          element: <AnalysisResult />,
        },
        {
          path: "/attendance",
          element: <Attendance />,
          children: [
            {
              path: "/attendance",
              element: <Navigate to="dashboard" />,
            },
            {
              path: "/attendance/dashboard",
              element: <AttendanceDashboard />,
            },
            {
              path: "/attendance/report",
              element: <AttendanceReport />,
            },
            {
              path: "/attendance/entry-history",
              element: <EntryHistory />,
            },
          ],
        },
        {
          path: "/security",
          element: <Security />,
          children: [
            {
              path: "/security",
              element: <Navigate to="entry-record" />,
            },
            {
              path: "/security/entry-record",
              element: <EntryRecord />,
            },
            {
              path: "/security/report",
              element: <SecurityReport />,
            },
            {
              path: "/security/maintain",
              element: <Maintain />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router}>
      <Outlet />
    </RouterProvider>
  );
}

export default App;
