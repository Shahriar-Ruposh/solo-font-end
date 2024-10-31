// src/components/GameCard.tsx
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Game } from "../types";

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => (
  <Link to={`/games/${game.id}`} className="group">
    <div>
      <img src={`../../public/vite.svg`} alt={`${game.title} thumbnail`} />
      <div>
        <h3>{game.title}</h3>
        <p>{game.description}</p>
        <div>
          <span>{game.publisher}</span>
          <div>
            <Star />
            <span>{game.avg_user_rating}</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default GameCard;
