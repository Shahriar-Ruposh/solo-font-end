import { GAMES_API_URL } from "../utils/constants";
import { Game } from "../types";

export const fetchGameDetails = async (token: any, gameId: string): Promise<Game> => {
  try {
    const response = await fetch(`${GAMES_API_URL}/${gameId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch game details");
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
