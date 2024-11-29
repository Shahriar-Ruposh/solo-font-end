import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Game } from "../types";

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const formattedDate = new Date(game.release_date).toLocaleDateString();

  return (
    //@ts-ignore
    <Link to={`/games/${game.id}`} className="block">
      <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform hover:scale-105">
        <img src={game.thumbnail || "https://assets-prd.ignimgs.com/2022/05/18/marves-spider-man0-5x-1652910625450.jpg?width=300&crop=1%3A1%2Csmart&auto=webp"} alt={`${game.title} thumbnail`} className="h-48 w-full object-cover" />
        <div className="p-6">
          <h3 className="mb-3 text-xl font-bold text-white">{game.title}</h3>
          <p className="mb-4 text-sm text-gray-400">{game.description.slice(0, 150)}...</p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Publisher: {game.publisher}</span>
            <span className="text-sm text-gray-400">Views: {game.view_count}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Release Date: {formattedDate}</span>
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 text-yellow-400" />
              <span className="text-white font-semibold">{game.avg_user_rating ? Number(game.avg_user_rating).toFixed(1) : "0.00"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {/* {console.log(game)} */}
            {
              //@ts-ignore
              game.genres?.map(
                (genre) => (
                  console.log(genre),
                  (
                    <span key={genre.name} className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                      {genre}
                    </span>
                  )
                )
              )
            }
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
