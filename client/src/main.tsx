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
import UserDashboard from "./pages/UserDashboadrd";
import AddGame from "./components/AddGame";
import { Edit } from "lucide-react";
import EditGame from "./components/EditGame";
// import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/:gameId" element={<GameDetails />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<SignUpForm />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/games" element={<AddGame />} />
          <Route path="/dashboard/games/:gameId" element={<EditGame />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
