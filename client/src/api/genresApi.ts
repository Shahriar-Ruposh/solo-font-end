import { GENRES_API_URL } from "../utils/constants";
import { Genre } from "../types";

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await fetch(GENRES_API_URL);
    if (!response.ok) throw new Error("Failed to fetch genres");
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
