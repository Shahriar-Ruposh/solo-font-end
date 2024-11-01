// src/components/EditGame.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gameSchema, GameFormValues } from "../validatores/validatores";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateUserGameThunk, fetchUserGameByIdThunk } from "../store/userGameReducer";
import { useParams } from "react-router-dom";

const EditGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const game = useSelector((state: RootState) => state.userGames.games.find((g) => g.id === gameId));
  const { data: genres } = useSelector((state: RootState) => state.genres);
  const error = useSelector((state: RootState) => state.userGames.error);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      title: "",
      description: "",
      release_date: "",
      publisher: "",
      thumbnail: "",
      genres: [],
    },
  });

  useEffect(() => {
    if (gameId && !game && token) {
      dispatch(fetchUserGameByIdThunk(gameId, token.toString()) as any);
    }
  }, [dispatch, gameId, game, token]);

  useEffect(() => {
    if (game) {
      setValue("title", game.title);
      setValue("description", game.description);
      setValue("release_date", game.release_date);
      setValue("publisher", game.publisher);
      setValue("thumbnail", game.thumbnail);
      setValue("genres", [game.genres[0].id, ...game.genres.slice(1).map((g) => g.id)]);
    }
  }, [game, setValue]);

  const onSubmit = (data: GameFormValues) => {
    if (token && gameId) {
      dispatch(updateUserGameThunk(gameId, data, token) as any);
    }
  };

  return (
    <div>
      <h2>Edit Game</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Title
          <input {...register("title")} placeholder="Title" />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </label>

        <label>
          Description
          <textarea {...register("description")} placeholder="Description" />
          {errors.description && <p className="error">{errors.description.message}</p>}
        </label>

        <label>
          Release Date
          <input type="date" {...register("release_date")} />
          {errors.release_date && <p className="error">{errors.release_date.message}</p>}
        </label>

        <label>
          Publisher
          <input {...register("publisher")} placeholder="Publisher" />
          {errors.publisher && <p className="error">{errors.publisher.message}</p>}
        </label>

        <label>
          Thumbnail URL
          <input {...register("thumbnail")} placeholder="Thumbnail URL" />
          {errors.thumbnail && <p className="error">{errors.thumbnail.message}</p>}
        </label>

        <label>
          Genres
          <select {...register("genres")} multiple>
            {genres?.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {errors.genres && <p className="error">{errors.genres.message}</p>}
        </label>

        <button type="submit">Update Game</button>
      </form>
    </div>
  );
};

export default EditGame;
