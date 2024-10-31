import { GAMES_API_URL } from "../utils/constants";
import { Game } from "../types";

export const fetchGames = async (filters: Record<string, string>): Promise<Game[]> => {
  try {
    let url;
    if (filters) {
      const query = new URLSearchParams(filters).toString();
      url = `${GAMES_API_URL}?${query}`;
    } else {
      url = GAMES_API_URL;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch games");

    const data = await response.json();
    return data.games;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
