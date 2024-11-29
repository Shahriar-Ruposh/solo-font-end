import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import GameDetails from "./pages/GameDetails";
import Navbar from "./layouts/NavBar";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./store/store";
import UserDashboard from "../src/pages/UserDashboadrd";
import AddGame from "./components/AddGame";
import EditGame from "./components/EditGame";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"; // import PublicRoute

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/:gameId" element={<GameDetails />} />

        {/* Public Routes for login and register */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<SignUpForm />} />
        </Route>

        {/* Protected Routes for authenticated users */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<UserDashboard />} />
          <Route path="games" element={<AddGame />} />
          <Route path="games/:gameId" element={<EditGame />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
