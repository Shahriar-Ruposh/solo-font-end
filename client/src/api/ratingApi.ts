import { API_BASE_URL } from "../utils/constants";
export const fetchRatings = async (gameId: string) => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/ratings`);
  if (!response.ok) throw new Error("Failed to fetch ratings");
  return response.json();
};

export const postRating = async (gameId: string, token: string, rating: number) => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rating }),
  });
  if (!response.ok) throw new Error("Failed to post rating");
  return response.json();
};
