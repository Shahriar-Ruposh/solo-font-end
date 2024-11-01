import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logoutUserThunk } from "../store/authReducer";
import { Link } from "react-router-dom";

const NavBar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Game Review</h1>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                {" "}
                <button className="text-gray-300">Dash Board</button>{" "}
              </Link>
              <span className="text-gray-300">Welcome, {user?.name}</span>
              <button
                onClick={() => dispatch(logoutUserThunk() as any)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                Login
              </Link>
              <Link to="/register" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
