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
import "./index.css";

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
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
