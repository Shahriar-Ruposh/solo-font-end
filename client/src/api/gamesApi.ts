import { GAMES_API_URL } from "../utils/constants";
import { Game } from "../types";

export const fetchGames = async (filters: Record<string, string>, page: number, limit: number): Promise<{ games: Game[]; currentPage: number; totalPages: number }> => {
  try {
    let url;
    if (filters) {
      const query = new URLSearchParams(filters).toString();
      url = `${GAMES_API_URL}?${query}&page=${page}&limit=${limit}`;
    } else {
      url = `${GAMES_API_URL}?page=${page}&limit=${limit}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch games");

    const data = await response.json();
    return {
      games: data.games,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
