import { Dispatch } from "redux";
import { loginUser, registerUser, logoutUser } from "../api/authApi";

const SET_USER = "SET_USER";
const LOGOUT = "LOGOUT";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";

interface AuthState {
  user: { userId: string; email: string; name: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthAction {
  type: string;
  payload?: any;
}

const initialState: AuthState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  isAuthenticated: localStorage.getItem("token") ? true : false,
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload.user, token: action.payload.token, isLoading: false, isAuthenticated: true };
    case LOGOUT:
      return { ...state, user: null, token: null, isAuthenticated: false };
    case SET_LOADING:
      return { ...state, isLoading: true, error: null };
    case SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const setUser = (user: any, token: string) => ({ type: SET_USER, payload: { user, token } });
export const logout = () => ({ type: LOGOUT });
export const setLoading = () => ({ type: SET_LOADING });
export const setError = (error: string) => ({ type: SET_ERROR, payload: error });

export const registerUserThunk = (name: string, email: string, password: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading());
  try {
    const response = await registerUser(name, email, password);
    const { user, token } = response;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch(setUser(user, token));

    return true;
  } catch (error: any) {
    dispatch(setError(error.message || "Registration failed"));
    return false;
  }
};

export const loginUserThunk = (email: string, password: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading());
  try {
    const response = await loginUser(email, password);
    const { user, token } = response;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch(setUser(user, token));
    return true;
  } catch (error: any) {
    dispatch(setError(error.message || "Login failed"));
    return false;
  }
};

export const logoutUserThunk = () => async (dispatch: Dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      await logoutUser(token);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
};
