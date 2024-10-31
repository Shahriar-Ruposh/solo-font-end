import { API_BASE_URL } from "../utils/constants";

export const fetchComments = async (gameId: string) => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/comments`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

export const postComment = async (gameId: string, token: string, comment: string) => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment }),
  });
  if (!response.ok) throw new Error("Failed to post comment");
  return response.json();
};
