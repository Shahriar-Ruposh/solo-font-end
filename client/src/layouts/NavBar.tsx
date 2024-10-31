// src/layouts/NavBar.tsx
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logoutUserThunk } from "../store/authReducer";

import { Link } from "react-router-dom";
// import { Search } from "lucide-react";

const NavBar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <nav>
      <h1>Game Review</h1>

      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.name}</span>
          <button onClick={() => dispatch(logoutUserThunk() as any)}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
