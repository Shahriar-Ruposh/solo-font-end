import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Game } from "../types";

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => (
  <Link to={`/games/${game.id}`} className="block">
    <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all hover:scale-105">
      {/* <img src={`../../public/vite.svg`} alt={`${game.title} thumbnail`} className="h-48 w-full object-cover" /> */}
      <img src={game.thumbnail} defaultValue={`../../public/vite.svg`} alt={`${game.title} thumbnail`} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="mb-2 text-xl font-bold">{game.title}</h3>
        <p className="mb-4 text-sm text-gray-400">{game.description.slice(0, 150)}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{game.publisher}</span>
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span>{game.avg_user_rating}</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default GameCard;
