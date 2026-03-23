import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Master = lazy(() => import("./pages/Master"));
const Meetings = lazy(() => import("./pages/Meetings"));
const Reports = lazy(() => import("./pages/Reports"));
const Attendance = lazy(() => import("./pages/Attendance"));
const NotFound = lazy(() => import("./pages/NotFound"));

const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

function App() {
  const location = useLocation();

  const knownPaths = [
    "/",
    "/signup",
    "/dashboard",
    "/meetings",
    "/attendance",
    "/profile",
    "/master",
    "/reports"
  ];

  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";
  const isNotFound = !knownPaths.includes(location.pathname);

  const hideHeader = isAuthPage || isNotFound;

  const hideFooter = isAuthPage;

  return (
    <div>
      {!hideHeader && <Header />}

      <Suspense fallback={<div className="loading-screen">Loading MOM...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              isAuthenticated() ? (
                <Dashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/meetings"
            element={
              isAuthenticated() ? (
                <Meetings />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/attendance"
            element={
              isAuthenticated() ? <Attendance /> : <Navigate to="/" />
            }
          />

          <Route
            path="/profile"
            element={
              isAuthenticated() ? <Profile /> : <Navigate to="/" />
            }
          />

          <Route
            path="/master"
            element={
              isAuthenticated() ? <Master /> : <Navigate to="/" />
            }
          />

          <Route
            path="/reports"
            element={
              isAuthenticated() ? <Reports /> : <Navigate to="/" />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
