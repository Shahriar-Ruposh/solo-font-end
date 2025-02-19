import { Dispatch } from "redux";
import { fetchComments, postComment } from "../api/commentApi";

const SET_COMMENTS = "SET_COMMENTS";
const ADD_COMMENT = "ADD_COMMENT";
const SET_COMMENT_ERROR = "SET_COMMENT_ERROR";

interface CommentState {
  comments: Array<any>;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  error: null,
};

export const commentReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_COMMENTS:
      return { ...state, comments: action.payload };
    case ADD_COMMENT:
      return { ...state, comments: [...state.comments, action.payload] };
    case SET_COMMENT_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Action Creators
export const setComments = (comments: any) => ({ type: SET_COMMENTS, payload: comments });
export const addComment = (comment: any) => ({ type: ADD_COMMENT, payload: comment });
export const setCommentError = (error: string) => ({ type: SET_COMMENT_ERROR, payload: error });

// Thunk Actions
export const fetchCommentsThunk = (gameId: string) => async (dispatch: Dispatch) => {
  try {
    const comments = await fetchComments(gameId);
    dispatch(setComments(comments));
  } catch (error) {
    dispatch(setCommentError(error.message));
  }
};

export const postCommentThunk = (gameId: string, token: string, comment: string) => async (dispatch: Dispatch) => {
  try {
    const newComment = await postComment(gameId, token, comment);
    dispatch(addComment(newComment));
  } catch (error) {
    dispatch(setCommentError(error.message));
  }
};
