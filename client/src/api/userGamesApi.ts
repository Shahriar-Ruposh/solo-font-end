// src/api/userGamesApi.ts
import { API_BASE_URL } from "../utils/constants";

export const fetchUserGames = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/games/my-games`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch user games");
  return response.json();
};

export const fetchUserGameById = async (gameId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/games/my-games/${gameId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch game details");
  const data = await response.json();
  return data[0];
};

export const createUserGame = async (gameData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(gameData),
  });
  if (!response.ok) throw new Error("Failed to create game");
  return response.json();
};

export const updateUserGame = async (gameId: string, gameData: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(gameData),
  });
  if (!response.ok) throw new Error("Failed to update game");
  return response.json();
};

export const deleteUserGame = async (gameId: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete game");
  return response.json();
};
